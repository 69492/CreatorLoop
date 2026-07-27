"""
Groq provider — implements AIProviderInterface via LangChain.

Uses ONE optimised prompt → ONE API call → structured JSON response.
All six creative pipeline sections are produced in a single request.

JSON reliability pipeline
─────────────────────────
generate_json() follows this sequence:

  1. Request with response_format=json_object (Groq JSON mode)  ← fastest path
  2. If JSON mode isn't supported, request as plain text
  3. Pass raw response through safe_parse_json() (6 cleaning strategies)
  4. Validate parsed dict with CreatorLoopResponse (Pydantic v2)
  5. If parsing still fails → send ONE automatic repair request to Groq
  6. Re-run safe_parse_json() on the repaired response
  7. If still failing → raise AIProviderError with full diagnostic info
"""
from __future__ import annotations

import json
import time
from typing import Any

from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage

from app.ai.providers.interfaces.ai_provider_interface import AIProviderInterface
from app.ai.providers.exceptions import AIProviderError
from app.core.logging import get_logger
from app.utils.json_parser import safe_parse_json
from app.utils.response_schemas import validate_response_safe

logger = get_logger(__name__)

# System prompt used when asking Groq to repair malformed JSON
_REPAIR_SYSTEM = (
    "You are a JSON repair tool. "
    "The user will give you a malformed JSON string. "
    "Return ONLY the corrected, valid JSON object. "
    "Do not add any explanation, markdown fences, or prose. "
    "Start with { and end with }."
)

_REPAIR_USER_TEMPLATE = (
    "The following JSON is malformed. Fix all syntax errors and return only the corrected JSON:\n\n{malformed}"
)


class GroqProvider(AIProviderInterface):
    """
    Groq LLM provider.

    Configured via Settings (GROQ_API_KEY, MODEL_NAME, TEMPERATURE, MAX_OUTPUT_TOKENS).
    Uses LangChain's ChatGroq integration under the hood.
    Future providers must implement AIProviderInterface to remain pluggable.
    """

    def __init__(
        self,
        api_key: str,
        model_name: str = "llama-3.3-70b-versatile",
        temperature: float = 0.7,
        max_output_tokens: int = 8192,
    ) -> None:
        self._model_name = model_name
        self._api_key = api_key
        self._temperature = temperature
        self._max_output_tokens = max_output_tokens

        # Primary LLM instance (plain text / JSON mode)
        self._llm = ChatGroq(
            api_key=api_key,
            model=model_name,
            temperature=temperature,
            max_tokens=max_output_tokens,
            timeout=90,
        )

        # JSON-mode LLM — response_format forces valid JSON output
        try:
            self._llm_json = self._llm.bind(
                response_format={"type": "json_object"}
            )
            self._json_mode_available = True
        except Exception:
            self._llm_json = self._llm
            self._json_mode_available = False

        # Repair LLM — low temperature for deterministic fixes
        self._llm_repair = ChatGroq(
            api_key=api_key,
            model=model_name,
            temperature=0.0,
            max_tokens=max_output_tokens,
            timeout=90,
        )

        logger.info(
            "GroqProvider initialised — model=%s json_mode=%s",
            model_name,
            self._json_mode_available,
        )

    # ── Public interface ───────────────────────────────────────────────────────

    async def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
        options: dict[str, Any] | None = None,
    ) -> str:
        """Generate a plain-text response from Groq."""
        messages = _build_messages(prompt, system_prompt)
        t0 = time.perf_counter()
        try:
            response = await self._llm.ainvoke(messages)
            elapsed = (time.perf_counter() - t0) * 1000
            _log_usage(self._model_name, elapsed, response)
            return response.content
        except Exception as exc:
            elapsed = (time.perf_counter() - t0) * 1000
            logger.error("GroqProvider.generate failed after %.0fms: %s", elapsed, exc)
            raise _map_error(exc) from exc

    async def generate_json(
        self,
        prompt: str,
        system_prompt: str | None = None,
    ) -> dict[str, Any]:
        """
        Generate a response and return it as a validated dict.

        Reliability pipeline:
            1. JSON-mode request (if supported) — Groq guarantees valid JSON
            2. safe_parse_json() with 6 progressive cleaning strategies
            3. Pydantic validation with safe defaults for missing fields
            4. One automatic repair request on any parse failure
        """
        json_instruction = (
            "\n\nCRITICAL JSON OUTPUT RULES:\n"
            "- Respond ONLY with a single valid JSON object.\n"
            "- Do NOT wrap output in markdown code fences (no ```json or ```).\n"
            "- Do NOT include any prose, commentary, or explanation.\n"
            "- Do NOT use trailing commas.\n"
            "- Do NOT include literal newline characters inside string values; "
            "use \\n instead.\n"
            "- Escape all special characters in string values.\n"
            "- Start your response with { and end with }.\n"
            "- Every string value must be on one line or properly escaped."
        )
        augmented_system = ((system_prompt or "") + json_instruction).strip()
        messages = _build_messages(prompt, augmented_system)

        # ── Attempt 1: JSON-mode request ───────────────────────────────────────
        t0 = time.perf_counter()
        raw: str = ""
        try:
            llm = self._llm_json if self._json_mode_available else self._llm
            response = await llm.ainvoke(messages)
            elapsed = (time.perf_counter() - t0) * 1000
            raw = response.content
            _log_usage(self._model_name, elapsed, response)
            logger.debug(
                "GroqProvider.generate_json raw response (first 400 chars): %s",
                raw[:400],
            )
        except Exception as exc:
            elapsed = (time.perf_counter() - t0) * 1000
            logger.error(
                "GroqProvider.generate_json: API call failed after %.0fms: %s",
                elapsed, exc,
            )
            raise _map_error(exc) from exc

        # ── Attempt 2: parse + validate ────────────────────────────────────────
        parsed, repair_needed = _parse_and_validate(raw, attempt=1)
        if not repair_needed:
            return parsed

        # ── Attempt 3: repair ──────────────────────────────────────────────────
        logger.warning(
            "GroqProvider.generate_json: first parse failed — sending repair request. "
            "Malformed snippet: %s",
            raw[:300],
        )
        repaired_raw = await self._request_repair(raw)
        logger.debug(
            "GroqProvider.generate_json: repair response (first 400 chars): %s",
            repaired_raw[:400],
        )

        parsed, repair_needed = _parse_and_validate(repaired_raw, attempt=2)
        if not repair_needed:
            return parsed

        # ── All strategies exhausted ───────────────────────────────────────────
        raise AIProviderError(
            f"AI response could not be parsed as valid JSON after repair attempt. "
            f"Raw response (first 500 chars): {raw[:500]}"
        )

    def get_provider_name(self) -> str:
        return f"Groq ({self._model_name})"

    # ── Internal helpers ───────────────────────────────────────────────────────

    async def _request_repair(self, malformed: str) -> str:
        """Ask Groq to fix its own malformed JSON."""
        repair_messages = [
            SystemMessage(content=_REPAIR_SYSTEM),
            HumanMessage(content=_REPAIR_USER_TEMPLATE.format(malformed=malformed)),
        ]
        t0 = time.perf_counter()
        try:
            response = await self._llm_repair.ainvoke(repair_messages)
            elapsed = (time.perf_counter() - t0) * 1000
            logger.info(
                "GroqProvider.repair completed in %.0fms",
                elapsed,
            )
            return response.content
        except Exception as exc:
            elapsed = (time.perf_counter() - t0) * 1000
            logger.error(
                "GroqProvider.repair request failed after %.0fms: %s", elapsed, exc
            )
            raise _map_error(exc) from exc


# ── Module-level helpers ───────────────────────────────────────────────────────

def _parse_and_validate(raw: str, attempt: int) -> tuple[dict[str, Any], bool]:
    """
    Run safe_parse_json then Pydantic validation.

    Returns:
        (result_dict, repair_needed)
        repair_needed=False means success; True means caller should retry.
    """
    try:
        parsed = safe_parse_json(raw)
    except ValueError as exc:
        logger.warning(
            "safe_parse_json attempt %d failed: %s",
            attempt, exc,
        )
        return {}, True

    validated, errors = validate_response_safe(parsed)
    if errors:
        logger.warning(
            "Pydantic validation attempt %d — non-fatal errors (defaults used): %s",
            attempt, errors,
        )
    else:
        logger.debug("Pydantic validation attempt %d — clean pass", attempt)

    return validated, False


def _build_messages(
    prompt: str, system_prompt: str | None
) -> list:
    messages = []
    if system_prompt:
        messages.append(SystemMessage(content=system_prompt))
    messages.append(HumanMessage(content=prompt))
    return messages


def _log_usage(model_name: str, elapsed: float, response: Any) -> None:
    usage = getattr(response, "usage_metadata", None) or getattr(
        response, "response_metadata", {}
    ).get("token_usage", {})
    prompt_tokens = (
        usage.get("input_tokens") or usage.get("prompt_tokens", "?")
        if usage else "?"
    )
    completion_tokens = (
        usage.get("output_tokens") or usage.get("completion_tokens", "?")
        if usage else "?"
    )
    logger.info(
        "Groq response — model=%s elapsed=%.0fms prompt_tokens=%s completion_tokens=%s",
        model_name, elapsed, prompt_tokens, completion_tokens,
    )


# ── Error mapping ──────────────────────────────────────────────────────────────

def _map_error(exc: Exception) -> AIProviderError:
    """Translate Groq/HTTP exceptions into friendly AIProviderError messages."""
    msg = str(exc).lower()

    if "401" in msg or "authentication" in msg or "api_key" in msg or "invalid api" in msg:
        return AIProviderError(
            "Invalid Groq API key. Please check your GROQ_API_KEY in .env."
        )
    if "403" in msg or "forbidden" in msg:
        return AIProviderError(
            "Access forbidden. Verify your Groq API key has the required permissions."
        )
    if "404" in msg or "model_not_found" in msg:
        return AIProviderError(
            f"Model not found. Check MODEL_NAME in .env (e.g. llama-3.3-70b-versatile). Error: {exc}"
        )
    if "408" in msg or "timeout" in msg or "timed out" in msg:
        return AIProviderError(
            "Request timed out. The model took too long to respond. Try a shorter idea or retry."
        )
    if "429" in msg or "rate_limit" in msg or "rate limit" in msg:
        return AIProviderError(
            "Groq rate limit reached. Please wait a moment and try again."
        )
    if "500" in msg or "internal server" in msg:
        return AIProviderError(
            "Groq returned an internal server error. Please retry in a few moments."
        )
    if "503" in msg or "service unavailable" in msg or "overloaded" in msg:
        return AIProviderError(
            "Groq is temporarily unavailable. Please retry in a few moments."
        )
    if "connection" in msg or "network" in msg or "connect" in msg:
        return AIProviderError(
            "Network error reaching Groq. Check your internet connection and retry."
        )
    return AIProviderError(f"AI provider error: {exc}")
