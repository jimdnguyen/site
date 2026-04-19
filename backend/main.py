import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from slowapi import Limiter
from slowapi.util import get_remote_address

from routes import chat, health

load_dotenv(Path(__file__).parent.parent / ".env")

app = FastAPI()

allowed_origins = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

app.include_router(health.router, prefix="/api")
app.include_router(chat.router, prefix="/api")

# Serve static frontend (Docker build copies dist/ alongside backend)
_dist = Path(__file__).parent / "dist"
if _dist.is_dir():
    app.mount("/assets", StaticFiles(directory=_dist / "assets"), name="assets")

    @app.get("/{path:path}")
    async def spa_fallback(path: str):
        file = _dist / path
        if file.is_file():
            return FileResponse(file)
        return FileResponse(_dist / "index.html")
