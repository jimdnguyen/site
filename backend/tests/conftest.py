import pytest
from routes.chat import limiter


@pytest.fixture(autouse=True)
def reset_rate_limiter():
    """Clear rate limit counters between tests."""
    limiter._storage.reset()
    yield
