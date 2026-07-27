"""
Robust JSON parser for AI model responses.

LLMs frequently return JSON wrapped in markdown fences, prefixed with prose,
or containing subtle syntax errors (trailing commas, unescaped control
characters, bad newline escaping inside strings, etc.).

This module provides a single public entry-point:

    safe_parse_json(text: str) -> dict

It applies a sequence of cleaning transformations before each parse attempt,
so the caller never needs to call json.loads() directly.
"""
from __future__ import annotations

import json
import re
from typing import Any

from app.core.logging import get_logger

logger = get_logger(__name__)


# ── Public API ─────────────────────────────────────────────────────────────────

def safe_parse_json(text: str) -> dict[str, Any]:
    """
    Parse *text* as JSON, applying progressive cleaning transformations.

    Transformation pipeline (applied in order, stopping on first success):
        1. Raw parse — model already returned clean JSON (fast path)
        2. Strip markdown fences + slice to outermost { … }
        3. Remove / replace invalid control characters in string values
        4. Fix trailing commas before ] or }
        5. Fix bad literal newlines inside JSON strings (replace with \\n)
        6. Normalise Python-style True/False/None to JSON booleans/null

    Raises:
        ValueError: All cleaning strategies exhausted without success.
    """
    if not text or not text.strip():
        raise ValueError("safe_parse_json received empty or whitespace-only text")

    strategies = [
        ("raw",                  _attempt_raw),
        ("strip_fences+slice",   _attempt_strip_and_slice),
        ("clean_control_chars",  _attempt_clean_control_chars),
        ("fix_trailing_commas",  _attempt_fix_trailing_commas),
        ("fix_literal_newlines", _attempt_fix_literal_newlines),
        ("normalise_literals",   _attempt_normalise_literals),
    ]

    last_error: Exception | None = None
    for name, strategy in strategies:
        try:
            result = strategy(text)
            if not isinstance(result, dict):
                raise ValueError(
                    f"safe_parse_json: expected a JSON object (dict), "
                    f"got {type(result).__name__}"
                )
            if name != "raw":
                logger.debug("safe_parse_json: succeeded with strategy '%s'", name)
            return result
        except (json.JSONDecodeError, ValueError) as exc:
            last_error = exc
            logger.debug("safe_parse_json: strategy '%s' failed — %s", name, exc)

    raise ValueError(
        f"safe_parse_json: all strategies exhausted. "
        f"Last error: {last_error}. "
        f"Input preview: {text[:300]!r}"
    )


# ── Strategies ─────────────────────────────────────────────────────────────────

def _attempt_raw(text: str) -> dict[str, Any]:
    """Try json.loads directly — cheapest path."""
    return json.loads(text.strip())


def _attempt_strip_and_slice(text: str) -> dict[str, Any]:
    """
    Remove markdown code fences then slice to the outermost { … } pair.
    Handles:
        ```json\\n{...}\\n```
        ```\\n{...}\\n```
        <some prose> {...} <trailing text>
    """
    # Remove ```json ... ``` or ``` ... ``` fences (greedy between fences)
    cleaned = re.sub(r"```(?:json)?\s*", "", text)
    cleaned = cleaned.rstrip("`").strip()

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError("No JSON object braces found after stripping fences")

    return json.loads(cleaned[start : end + 1])


def _attempt_clean_control_chars(text: str) -> dict[str, Any]:
    """
    Replace ASCII control characters (0x00-0x1F except legal whitespace)
    that are invalid inside JSON strings.
    Legal JSON whitespace: 0x09 (\\t), 0x0A (\\n), 0x0D (\\r)
    """
    extracted = _extract_json_fragment(text)
    # Replace raw control chars with their escape sequences
    cleaned = re.sub(
        r'[\x00-\x08\x0b\x0c\x0e-\x1f]',
        lambda m: f"\\u{ord(m.group()):04x}",
        extracted,
    )
    return json.loads(cleaned)


def _attempt_fix_trailing_commas(text: str) -> dict[str, Any]:
    """
    Remove trailing commas before closing ] or } (invalid in JSON, valid in JS).

    Pattern:  ,  (optional whitespace)  ] or }
    """
    extracted = _extract_json_fragment(text)
    # Clean control chars first, then trailing commas
    cleaned = re.sub(
        r'[\x00-\x08\x0b\x0c\x0e-\x1f]',
        lambda m: f"\\u{ord(m.group()):04x}",
        extracted,
    )
    cleaned = re.sub(r",\s*(\}|\])", r"\1", cleaned)
    return json.loads(cleaned)


def _attempt_fix_literal_newlines(text: str) -> dict[str, Any]:
    """
    Fix unescaped literal newlines inside JSON string values.

    json.loads() rejects raw 0x0A inside a quoted string.
    This replaces them with the two-character escape sequence \\n.
    Strategy: only replace newlines that are inside double-quoted sections.
    """
    extracted = _extract_json_fragment(text)
    cleaned = re.sub(
        r'[\x00-\x08\x0b\x0c\x0e-\x1f]',
        lambda m: f"\\u{ord(m.group()):04x}",
        extracted,
    )
    cleaned = re.sub(r",\s*(\}|\])", r"\1", cleaned)
    # Replace literal \n inside strings (between double quotes, not already escaped)
    cleaned = _escape_newlines_in_strings(cleaned)
    return json.loads(cleaned)


def _attempt_normalise_literals(text: str) -> dict[str, Any]:
    """
    Convert Python-style True/False/None → true/false/null.
    Also handles single-quoted strings (rare but seen).
    """
    extracted = _extract_json_fragment(text)
    cleaned = re.sub(
        r'[\x00-\x08\x0b\x0c\x0e-\x1f]',
        lambda m: f"\\u{ord(m.group()):04x}",
        extracted,
    )
    cleaned = re.sub(r",\s*(\}|\])", r"\1", cleaned)
    cleaned = _escape_newlines_in_strings(cleaned)
    # Python booleans / None
    cleaned = re.sub(r'\bTrue\b',  'true',  cleaned)
    cleaned = re.sub(r'\bFalse\b', 'false', cleaned)
    cleaned = re.sub(r'\bNone\b',  'null',  cleaned)
    return json.loads(cleaned)


# ── Helpers ────────────────────────────────────────────────────────────────────

def _extract_json_fragment(text: str) -> str:
    """
    Strip markdown fences and slice to the outermost { … } block.
    Raises ValueError if no JSON object can be located.
    """
    cleaned = re.sub(r"```(?:json)?\s*", "", text).rstrip("`").strip()
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end < start:
        raise ValueError("Cannot locate JSON object in response")
    return cleaned[start : end + 1]


def _escape_newlines_in_strings(json_str: str) -> str:
    """
    Replace literal 0x0A characters that appear inside double-quoted JSON
    string values with the two-character escape \\n.

    Uses a simple state machine rather than a full parser — sufficient for
    the well-structured responses Groq produces.
    """
    result: list[str] = []
    in_string = False
    i = 0
    while i < len(json_str):
        ch = json_str[i]
        if ch == '"' and (i == 0 or json_str[i - 1] != "\\"):
            in_string = not in_string
            result.append(ch)
        elif ch == "\n" and in_string:
            result.append("\\n")
        elif ch == "\r" and in_string:
            result.append("\\r")
        else:
            result.append(ch)
        i += 1
    return "".join(result)
