.PHONY: install prisma prisma-migrate build typecheck \
       forge-deps contracts contracts-test \
       abi-sync subgraph-prepare subgraph-codegen subgraph-build subgraph \
       relayer indexer bootstrap

# ── Dependencies ──────────────────────────────────────────────
install:
	pnpm install

forge-deps:
	cd packages/contracts && \
	  forge install foundry-rs/forge-std --no-commit && \
	  forge install OpenZeppelin/openzeppelin-contracts --no-commit && \
	  forge install OpenZeppelin/openzeppelin-contracts-upgradeable --no-commit

# ── Database ──────────────────────────────────────────────────
prisma:
	pnpm prisma:generate

prisma-migrate:
	pnpm prisma:migrate

# ── Smart Contracts ───────────────────────────────────────────
contracts:
	pnpm contracts:build

contracts-test:
	pnpm contracts:test

# ── ABI / Subgraph ───────────────────────────────────────────
abi-sync:
	./scripts/sync-abis.sh

subgraph-prepare:
	./scripts/prepare-subgraph.sh

subgraph-codegen:
	pnpm subgraph:codegen

subgraph-build:
	pnpm subgraph:build

subgraph: subgraph-prepare subgraph-codegen subgraph-build

# ── Applications ──────────────────────────────────────────────
build:
	pnpm build

typecheck:
	pnpm typecheck

relayer:
	pnpm relayer:dev

indexer:
	pnpm indexer:dev

# ── Full pipeline (CI / first-time setup) ─────────────────────
bootstrap: install forge-deps prisma contracts abi-sync subgraph build
