.PHONY: bootstrap install prisma build typecheck test lint clean contracts subgraph relayer indexer docker-up docker-down

# ── Full bootstrap (CI / first-time setup) ──────────────────────────
bootstrap: install prisma build typecheck
	@echo "✅  Bootstrap complete"

# ── Individual targets ──────────────────────────────────────────────
install:
	pnpm install

prisma:
	pnpm prisma:generate

build:
	pnpm build

typecheck:
	pnpm typecheck

test:
	pnpm test

lint:
	pnpm lint

contracts:
	pnpm contracts:build

subgraph:
	pnpm subgraph:build

relayer:
	pnpm relayer:dev

indexer:
	pnpm indexer:dev

# ── Docker helpers ──────────────────────────────────────────────────
docker-up:
	docker compose -f config/docker-compose.production.yaml up -d

docker-down:
	docker compose -f config/docker-compose.production.yaml down

# ── Cleanup ─────────────────────────────────────────────────────────
clean:
	rm -rf node_modules dist .turbo
	find . -name "dist" -type d -prune -exec rm -rf {} +
	find . -name ".turbo" -type d -prune -exec rm -rf {} +
