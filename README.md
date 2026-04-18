# Jim Nguyen — Portfolio Site

Personal portfolio and AI Digital Twin — built with SolidJS, Vite, and a FastAPI backend.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | SolidJS, Vite, vanilla CSS |
| Backend | FastAPI, Python 3.13, uv |
| AI chat | LiteLLM → OpenRouter |
| Testing | Vitest (unit), Playwright (E2E) |

## Features

- Animated hero, career timeline, skills grid, project portfolio
- AI Digital Twin chat widget — asks the backend, which proxies to an LLM
- Smooth scroll-reveal animations with `prefers-reduced-motion` support
- Fully responsive with mobile hamburger nav

## Local Development

### Frontend

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build → dist/
npm run test         # vitest unit tests
npm run test:e2e     # playwright E2E (needs backend running)
npm run lint
```

### Backend

```bash
cd backend
uv sync
uv run uvicorn main:app --reload --port 8001
```

**API Documentation** (when backend is running):
- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

### Environment

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend chat endpoint (defaults to `http://localhost:8001/api/chat`) |
| `OPENROUTER_API_KEY` | OpenRouter API key — used by the backend only, never exposed to the browser |

## Deployment

1. Build the frontend: `npm run build` — outputs to `dist/`
2. Serve `dist/` as static files (Netlify, Vercel, S3+CloudFront, etc.)
3. Deploy the `backend/` as a Python service (Render, Railway, Fly.io, etc.)
4. Set `VITE_API_URL` at build time to point to the deployed backend
5. Update `allow_origins` in `backend/main.py` to your frontend domain
