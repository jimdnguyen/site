.PHONY: start stop build logs test test-backend test-frontend test-e2e clean

start:
	docker compose up -d --build
	@echo "App running at http://localhost:8000"

stop:
	docker compose down

build:
	docker compose build --no-cache

logs:
	docker compose logs -f

test: test-backend test-frontend

test-backend:
	cd backend && uv run pytest -v

test-frontend:
	npm test

test-e2e:
	npm run test:e2e

clean:
	docker compose down --volumes 2>/dev/null || true
