"""
Tests for app/utils/json_parser.py — safe_parse_json()

Covers 15 distinct scenarios:
    1.  Perfect JSON string
    2.  Markdown-wrapped (```json ... ```)
    3.  Markdown-wrapped without language tag (``` ... ```)
    4.  JSON preceded by prose / explanatory text
    5.  JSON followed by trailing prose
    6.  Both leading and trailing prose
    7.  Invalid ASCII control characters inside string values
    8.  Trailing commas before } and ]
    9.  Literal (unescaped) newlines inside string values
   10.  Python-style True / False / None literals
   11.  Empty / whitespace-only input → ValueError
   12.  Completely non-JSON input → ValueError
   13.  Deeply nested object still parses
   14.  Combined pathology (fences + trailing comma + control char)
   15.  Missing required sections → validate_response_safe returns defaults

Additionally two Pydantic schema tests:
   16.  validate_response() accepts a complete valid dict
   17.  validate_response() coerces field types (keywords as comma-string)
"""
import json
import pytest

from app.utils.json_parser import safe_parse_json, _escape_newlines_in_strings
from app.utils.response_schemas import validate_response, validate_response_safe


# ── Helpers ────────────────────────────────────────────────────────────────────

def _minimal_response(**overrides) -> dict:
    """Return the minimum valid CreatorLoop response shape."""
    base = {
        "analysis": {
            "topic": "Test topic",
            "audience": "Developers",
            "purpose": "Education",
            "tone": "educational",
            "keywords": ["python", "test", "json"],
        },
        "brainstorm": [
            {"title": "Concept A", "hook": "Hook A", "description": "Desc A"},
            {"title": "Concept B", "hook": "Hook B", "description": "Desc B"},
            {"title": "Concept C", "hook": "Hook C", "description": "Desc C"},
        ],
        "recommended_direction": {
            "title": "Concept A",
            "reason": "Most engaging.",
        },
        "content": {
            "title": "Test Title",
            "outline": ["Intro", "Body", "Outro"],
            "draft": "Full draft text here.",
        },
        "adaptations": {
            "youtube": "YT desc",
            "linkedin": "LI post",
            "instagram": "IG caption",
            "twitter": "TW thread",
            "blog": "Blog intro",
            "podcast": "Podcast script",
        },
        "creative_suggestions": {
            "seo_keywords": ["kw1", "kw2"],
            "cta": "Subscribe now",
            "thumbnail_ideas": ["Idea 1", "Idea 2"],
            "improvements": ["Tip 1", "Tip 2"],
        },
    }
    base.update(overrides)
    return base


# ── Test 1: Perfect JSON string ────────────────────────────────────────────────

def test_perfect_json():
    """Strategy: raw — json.loads succeeds on first attempt."""
    data = {"key": "value", "number": 42, "flag": True}
    raw = json.dumps(data)
    result = safe_parse_json(raw)
    assert result == data


# ── Test 2: Markdown-wrapped with language tag ─────────────────────────────────

def test_markdown_with_json_tag():
    """Strategy: strip_fences+slice."""
    data = {"hello": "world"}
    raw = f"```json\n{json.dumps(data)}\n```"
    result = safe_parse_json(raw)
    assert result == data


# ── Test 3: Markdown-wrapped without language tag ──────────────────────────────

def test_markdown_without_language_tag():
    """Strategy: strip_fences+slice."""
    data = {"hello": "world"}
    raw = f"```\n{json.dumps(data)}\n```"
    result = safe_parse_json(raw)
    assert result == data


# ── Test 4: JSON preceded by prose ────────────────────────────────────────────

def test_json_preceded_by_prose():
    """Strategy: strip_fences+slice — slices to { … }."""
    data = {"answer": 42}
    raw = f"Sure! Here is the JSON you requested:\n\n{json.dumps(data)}"
    result = safe_parse_json(raw)
    assert result == data


# ── Test 5: JSON followed by trailing prose ────────────────────────────────────

def test_json_followed_by_trailing_prose():
    """Strategy: strip_fences+slice — rfind('}') discards trailing text."""
    data = {"answer": 42}
    raw = f"{json.dumps(data)}\n\nLet me know if you need anything else!"
    result = safe_parse_json(raw)
    assert result == data


# ── Test 6: Both leading and trailing prose ────────────────────────────────────

def test_json_surrounded_by_prose():
    data = {"section": "value"}
    raw = f"Here is your response:\n{json.dumps(data)}\nHope that helps!"
    result = safe_parse_json(raw)
    assert result == data


# ── Test 7: Invalid ASCII control characters inside string values ──────────────

def test_invalid_control_characters():
    """
    Strategy: clean_control_chars.
    Raw bytes 0x01 and 0x08 are illegal inside JSON strings.
    """
    # Build a JSON string that contains raw control chars by patching the bytes
    valid_json = json.dumps({"text": "hello world"})
    # Inject a raw BEL (0x07) character inside the string value
    malformed = valid_json.replace("hello world", "hello\x07world")
    result = safe_parse_json(malformed)
    # The control char should be escaped, making the value parseable
    assert "text" in result
    assert "hello" in result["text"]


# ── Test 8: Trailing commas before } and ] ─────────────────────────────────────

def test_trailing_commas():
    """
    Strategy: fix_trailing_commas.
    JavaScript allows trailing commas; JSON does not.
    """
    malformed = '{"key": "value", "list": [1, 2, 3,],}'
    result = safe_parse_json(malformed)
    assert result["key"] == "value"
    assert result["list"] == [1, 2, 3]


# ── Test 9: Literal newlines inside string values ──────────────────────────────

def test_literal_newlines_inside_strings():
    """
    Strategy: fix_literal_newlines.
    json.loads rejects a raw 0x0A inside a quoted string value.
    """
    # Construct the malformed bytes directly (can't use json.dumps — it would escape them)
    malformed = '{"draft": "Line one\nLine two\nLine three"}'
    result = safe_parse_json(malformed)
    assert "draft" in result
    assert "Line one" in result["draft"]
    assert "Line two" in result["draft"]


# ── Test 10: Python-style True / False / None literals ────────────────────────

def test_python_literals():
    """
    Strategy: normalise_literals.
    Python True/False/None are invalid JSON; should become true/false/null.
    """
    malformed = '{"active": True, "deleted": False, "extra": None}'
    result = safe_parse_json(malformed)
    assert result["active"] is True
    assert result["deleted"] is False
    assert result["extra"] is None


# ── Test 11: Empty input → ValueError ─────────────────────────────────────────

def test_empty_input_raises():
    with pytest.raises(ValueError, match="empty"):
        safe_parse_json("")


def test_whitespace_only_input_raises():
    with pytest.raises(ValueError, match="empty"):
        safe_parse_json("   \n\t  ")


# ── Test 12: Completely non-JSON input → ValueError ───────────────────────────

def test_completely_non_json_raises():
    with pytest.raises(ValueError):
        safe_parse_json("This is just a sentence with no JSON at all.")


# ── Test 13: Deeply nested object ─────────────────────────────────────────────

def test_deeply_nested_object():
    """Nesting should not confuse the brace-slicing logic."""
    data = {
        "level1": {
            "level2": {
                "level3": {
                    "level4": {"value": "deep"}
                }
            }
        }
    }
    raw = json.dumps(data)
    result = safe_parse_json(raw)
    assert result["level1"]["level2"]["level3"]["level4"]["value"] == "deep"


# ── Test 14: Combined pathology ────────────────────────────────────────────────

def test_combined_pathology():
    """
    Markdown fences + trailing comma + raw control character.
    All three cleaning steps must fire together.
    """
    inner = '{"msg": "hello\x03world", "list": [1, 2,]}'
    raw = f"```json\n{inner}\n```"
    result = safe_parse_json(raw)
    assert "msg" in result
    assert result["list"] == [1, 2]


# ── Test 15: Missing required sections → safe defaults ────────────────────────

def test_missing_sections_use_defaults():
    """
    validate_response_safe should return safe defaults for missing sections
    rather than raising an exception.
    """
    partial = {"analysis": {"topic": "AI", "audience": "devs", "purpose": "learn",
                             "tone": "casual", "keywords": []}}
    result, errors = validate_response_safe(partial)
    # Should not raise
    assert isinstance(result, dict)
    # Other sections should have default values
    assert "brainstorm" in result
    assert "content" in result


# ── Test 16: validate_response() accepts a complete valid dict ─────────────────

def test_validate_response_complete_dict():
    data = _minimal_response()
    result = validate_response(data)
    assert result["analysis"]["topic"] == "Test topic"
    assert len(result["brainstorm"]) == 3
    assert result["content"]["title"] == "Test Title"
    assert result["adaptations"]["youtube"] == "YT desc"
    assert result["creative_suggestions"]["cta"] == "Subscribe now"


# ── Test 17: validate_response() coerces comma-string keywords ────────────────

def test_validate_response_coerces_keywords_string():
    """AnalysisSection.keywords accepts a comma-separated string."""
    data = _minimal_response()
    data["analysis"]["keywords"] = "python, testing, json, pydantic"
    result = validate_response(data)
    assert isinstance(result["analysis"]["keywords"], list)
    assert "python" in result["analysis"]["keywords"]
    assert "testing" in result["analysis"]["keywords"]


# ── Test 18: _escape_newlines_in_strings helper ───────────────────────────────

def test_escape_newlines_in_strings_helper():
    """Unit test the internal helper directly."""
    raw = '{"key": "line1\nline2\nline3"}'
    escaped = _escape_newlines_in_strings(raw)
    # The literal newlines inside the quoted value should now be \\n
    assert json.loads(escaped)["key"] == "line1\nline2\nline3"
    # But the raw bytes 0x0A should not appear inside strings
    # (outside the string are fine — there are none here anyway)
    assert "\n" not in escaped


# ── Test 19: Array at top-level is rejected (we expect an object) ─────────────

def test_top_level_array_raises():
    """safe_parse_json targets a dict; a bare array has no braces to slice to."""
    with pytest.raises(ValueError):
        safe_parse_json('[1, 2, 3]')


# ── Test 20: Extra keys are silently dropped by the schema ────────────────────

def test_extra_keys_dropped_by_schema():
    """CreatorLoopResponse.accept_extra_keys should silently discard unknowns."""
    data = _minimal_response()
    data["unexpected_key"] = "should be dropped"
    data["another_unknown"] = 999
    result = validate_response(data)
    assert "unexpected_key" not in result
    assert "another_unknown" not in result
