"""
Google Gemini provider — implements AIProviderInterface via LangChain.
"""
from __future__ import annotations

import json
import re
from typing import Any

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

from app.ai.providers.interfaces.ai_provider_interface import AIProviderInterface
from app.ai.providers.exceptions import AIProviderError
from app.core.logging import get_logger

logger = get_logger(__name__)


class GeminiProvider(AIProviderInterface):
    """
    Google Gemini language model provider.

    Configured via Settings (GEMINI_API_KEY, MODEL_NAME, TEMPERATURE, MAX_OUTPUT_TOKENS).
    Uses LangChain's ChatGoogleGenerativeAI under the hood.
    """

    def __init__(
        self,
        api_key: str,
        model_name: str = "gemini-2.5-flash",
        temperature: float = 0.7,
        max_output_tokens: int = 8192,
    ) -> None:
        self._model_name = model_name
        self._llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=api_key,
            temperature=temperature,
            max_output_tokens=max_output_tokens,
        )
        logger.info("GeminiProvider initialised — model=%s", model_name)

    async def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
        options: dict[str, Any] | None = None,
    ) -> str:
        """Generate a plain-text response from Gemini."""
        messages = []
        if system_prompt:
            messages.append(SystemMessage(content=system_prompt))
        messages.append(HumanMessage(content=prompt))

        try:
            response = await self._llm.ainvoke(messages)
            return response.content
        except Exception as exc:
            logger.error("GeminiProvider.generate failed: %s", exc)
            raise AIProviderError(f"Gemini generation failed: {exc}") from exc

    async def generate_json(
        self,
        prompt: str,
        system_prompt: str | None = None,
    ) -> dict[str, Any]:
        """Generate a response and parse it as JSON."""
        json_system = (
            (system_prompt or "")
            + "\n\nIMPORTANT: Respond ONLY with valid JSON. "
            "Do not include markdown code fences, explanations, or any text outside the JSON object."
        ).strip()

        raw = await self.generate(prompt, system_prompt=json_system)
        return _extract_json(raw)

    def get_provider_name(self) -> str:
        return f"Google Gemini ({self._model_name})"


def _extract_json(raw: str) -> dict[str, Any]:
    """
    Robustly extract a JSON object from a raw model response.
    Handles markdown fences and surrounding whitespace.
    """
    # Strip markdown code fences if present
    cleaned = re.sub(r"```(?:json)?\s*", "", raw).strip().rstrip("`").strip()

    # Find the outermost { ... }
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1:
        raise AIProviderError(
            f"Model did not return valid JSON. Raw response (first 300 chars): {raw[:300]}"
        )

    json_str = cleaned[start : end + 1]
    try:
        return json.loads(json_str)
    except json.JSONDecodeError as exc:
        raise AIProviderError(
            f"Failed to parse JSON from model response: {exc}\n"
            f"Extracted string (first 300 chars): {json_str[:300]}"
        ) from exc
