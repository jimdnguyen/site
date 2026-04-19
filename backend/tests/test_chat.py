"""Tests for the /api/chat and /api/health endpoints."""
import json
from unittest.mock import MagicMock, patch

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from main import app


@pytest_asyncio.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_health(client):
    resp = await client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


# ---------------------------------------------------------------------------
# Chat — streaming response
# ---------------------------------------------------------------------------


def _make_chunk(content: str):
    """Build a minimal litellm streaming chunk mock."""
    chunk = MagicMock()
    chunk.choices[0].delta.content = content
    return chunk


def _mock_completion(chunks):
    """Patch litellm.completion to yield fake SSE chunks."""
    return patch(
        "routes.chat.completion",
        return_value=iter(chunks),
    )


@pytest.mark.asyncio
async def test_chat_streams_response(client):
    chunks = [_make_chunk("Hello"), _make_chunk(" world"), _make_chunk(None)]
    with _mock_completion(chunks):
        resp = await client.post(
            "/api/chat",
            json={"messages": [{"role": "user", "content": "Hi"}]},
        )
    assert resp.status_code == 200
    assert "text/event-stream" in resp.headers["content-type"]
    lines = [l for l in resp.text.splitlines() if l.startswith("data:")]
    payloads = [json.loads(l[len("data: "):]) for l in lines if l != "data: [DONE]"]
    contents = [p["content"] for p in payloads if "content" in p]
    assert contents == ["Hello", " world"]


@pytest.mark.asyncio
async def test_chat_ends_with_done(client):
    chunks = [_make_chunk("Hi")]
    with _mock_completion(chunks):
        resp = await client.post(
            "/api/chat",
            json={"messages": [{"role": "user", "content": "Hello"}]},
        )
    assert "data: [DONE]" in resp.text


@pytest.mark.asyncio
async def test_chat_streams_error_on_exception(client):
    with patch("routes.chat.completion", side_effect=RuntimeError("API key missing")):
        resp = await client.post(
            "/api/chat",
            json={"messages": [{"role": "user", "content": "hello"}]},
        )
    assert resp.status_code == 200
    assert "API key missing" in resp.text


# ---------------------------------------------------------------------------
# Rate limiting
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_chat_rate_limit(client):
    """11th request within a minute must return 429."""
    chunks = [_make_chunk("ok")]
    payload = {"messages": [{"role": "user", "content": "x"}]}
    with _mock_completion(chunks * 11):
        for _ in range(10):
            resp = await client.post("/api/chat", json=payload)
            assert resp.status_code != 429
        resp = await client.post("/api/chat", json=payload)
    assert resp.status_code == 429


# ---------------------------------------------------------------------------
# Edge cases
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_chat_with_empty_messages_array(client):
    """Empty messages array should still work (system prompt + no user messages)."""
    chunks = [_make_chunk("System response")]
    with _mock_completion(chunks):
        resp = await client.post("/api/chat", json={"messages": []})
    assert resp.status_code == 200
    assert "System response" in resp.text


@pytest.mark.asyncio
async def test_chat_with_very_long_message(client):
    """Very long message content should be handled gracefully."""
    long_content = "x" * 10000
    chunks = [_make_chunk("OK")]
    payload = {"messages": [{"role": "user", "content": long_content}]}
    with _mock_completion(chunks):
        resp = await client.post("/api/chat", json=payload)
    assert resp.status_code == 200
    assert "OK" in resp.text


@pytest.mark.asyncio
async def test_chat_missing_messages_key(client):
    """Request without 'messages' key should return validation error."""
    resp = await client.post("/api/chat", json={})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_chat_messages_not_list(client):
    """Request with non-list messages should return validation error."""
    resp = await client.post("/api/chat", json={"messages": "not a list"})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_chat_message_missing_role(client):
    """Message without 'role' field should return validation error."""
    resp = await client.post(
        "/api/chat",
        json={"messages": [{"content": "hello"}]},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_chat_message_missing_content(client):
    """Message without 'content' field should return validation error."""
    resp = await client.post(
        "/api/chat",
        json={"messages": [{"role": "user"}]},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_chat_multiple_sequential_requests(client):
    """Multiple sequential requests should not leak state between calls."""
    chunks1 = [_make_chunk("response1")]
    chunks2 = [_make_chunk("response2")]
    chunks3 = [_make_chunk("response3")]

    with _mock_completion(chunks1):
        resp1 = await client.post(
            "/api/chat",
            json={"messages": [{"role": "user", "content": "first"}]},
        )
    assert "response1" in resp1.text

    with _mock_completion(chunks2):
        resp2 = await client.post(
            "/api/chat",
            json={"messages": [{"role": "user", "content": "second"}]},
        )
    assert "response2" in resp2.text

    with _mock_completion(chunks3):
        resp3 = await client.post(
            "/api/chat",
            json={"messages": [{"role": "user", "content": "third"}]},
        )
    assert "response3" in resp3.text


@pytest.mark.asyncio
async def test_chat_with_multiple_messages_in_context(client):
    """Chat with multiple messages in conversation history should work."""
    chunks = [_make_chunk("response")]
    payload = {
        "messages": [
            {"role": "user", "content": "first"},
            {"role": "assistant", "content": "response"},
            {"role": "user", "content": "follow-up"},
        ]
    }
    with _mock_completion(chunks):
        resp = await client.post("/api/chat", json=payload)
    assert resp.status_code == 200
    assert "response" in resp.text


@pytest.mark.asyncio
async def test_chat_streaming_chunk_with_null_content(client):
    """Streaming chunks with null content should be skipped."""
    chunks = [_make_chunk("start"), _make_chunk(None), _make_chunk("end")]
    with _mock_completion(chunks):
        resp = await client.post(
            "/api/chat",
            json={"messages": [{"role": "user", "content": "test"}]},
        )
    text = resp.text
    assert "start" in text
    assert "end" in text
    # Null content chunks are not included
    lines = [l for l in text.splitlines() if l.startswith("data:")]
    payloads = [json.loads(l[len("data: "):]) for l in lines if l != "data: [DONE]"]
    contents = [p.get("content") for p in payloads if p.get("content") is not None]
    assert contents == ["start", "end"]
