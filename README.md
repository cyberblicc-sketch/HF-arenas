# HF-arenas

Crypto-native prediction markets for Hugging Face models, datasets, and Spaces.

## What this repo is

**THE ARENA // HF TOP** is a compile-ready monorepo containing:

| Package | Purpose |
|---------|---------|
| `packages/contracts` | Solidity market contracts (Foundry) |
| `apps/relayer` | NestJS gasless relay + oracle-signature service |
| `apps/indexer` | NestJS subgraph-to-Prisma sync service |
| `packages/shared-prisma` | Shared Prisma ORM client module |
| `prisma` | Database schema and migrations |
| `subgraph` | The Graph event indexing (AssemblyScript) |
| `config` | Docker Compose, OpenAPI spec |
| `docs` | Operational handoff documents |

## Current status

Pre-production engineering scaffold. Useful for implementation, review, and build-out, but not a substitute for:
- successful compilation and tests
- external smart contract audit
- jurisdiction-specific legal review
- production secrets management and deployment hardening

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 LTS | [nodejs.org](https://nodejs.org) |
| pnpm | 9.12.3 | `corepack enable && corepack prepare pnpm@9.12.3 --activate` |
| PostgreSQL | ≥ 15 | `brew install postgresql@15` or Docker |
| Redis | ≥ 7 | `brew install redis` or Docker |
| Foundry | latest | `curl -L https://foundry.paradigm.xyz \| bash && foundryup` |

## Quick start

```bash
# 1. Clone and install
git clone https://github.com/cyberblicc-sketch/HF-arenas.git
cd HF-arenas
pnpm install                 # or: make install

# 2. Environment
cp .env.example .env
#    → fill in DATABASE_URL, RPC_URL, ORACLE_PRIVATE_KEY, USDC_ADDRESS, GELATO_API_KEY

# 3. Database
#    Start Postgres (locally or via Docker):
docker compose -f config/docker-compose.production.yaml up db redis -d
pnpm prisma:generate         # generate Prisma client
pnpm prisma:migrate          # apply migrations

# 4. Contracts (requires Foundry)
cd packages/contracts
forge install                # install OpenZeppelin + forge-std
forge build                  # compile
forge test -vvv              # run tests
cd ../..

# 5. Build everything
make bootstrap               # install → prisma → build → typecheck

# 6. Run services
pnpm relayer:dev             # NestJS relayer on :3001
pnpm indexer:dev             # NestJS indexer on :3002
```

## Fee schedule (launch defaults)

| Fee | Basis points | Percentage |
|-----|-------------|------------|
| Protocol | 275 bps | 2.75% |
| Creator | 100 bps | 1.00% |
| Referral | 50 bps | 0.50% |
| Dispute reserve | 75 bps | 0.75% |
| **Total** | **500 bps** | **5.00%** |

Configured in `ArenaRegistry.sol` and enforced on-chain. Adjustable by `DEFAULT_ADMIN_ROLE` up to 50% max.

## Project structure

```
├── apps/
│   ├── relayer/          Gasless relay API (NestJS, port 3001)
│   └── indexer/          Subgraph sync service (NestJS, port 3002)
├── packages/
│   ├── contracts/        Solidity contracts (Foundry)
│   └── shared-prisma/    Shared Prisma module
├── prisma/               Schema + migrations
├── subgraph/             The Graph indexer (AssemblyScript)
├── config/               Docker Compose, OpenAPI spec
└── docs/                 Operational docs
```

## Available commands

| Command | Description |
|---------|-------------|
| `make bootstrap` | Full first-time setup (install → prisma → build → typecheck) |
| `make build` | Build all packages via Turbo |
| `make typecheck` | Type-check all TypeScript packages |
| `make test` | Run all tests |
| `make lint` | Lint all packages |
| `make contracts` | Build Solidity contracts |
| `make subgraph` | Build subgraph |
| `make relayer` | Start relayer in watch mode |
| `make indexer` | Start indexer in watch mode |
| `make docker-up` | Start all services via Docker Compose |
| `make docker-down` | Stop Docker Compose services |
| `make clean` | Remove node_modules, dist, .turbo |

## API documentation

When the relayer is running, Swagger UI is available at:

```
http://localhost:3001/api/docs
```

The OpenAPI spec is also available at `config/relayer.openapi.yaml`.

## Security notes

- **Sanctions screening** is fail-closed: if the screening provider is down, all addresses are treated as HIGH risk.
- **Webhook signatures** use `crypto.timingSafeEqual` to prevent timing attacks.
- **EIP-712 replay protection**: each bet requires an oracle signature with a per-user nonce and a 5-minute deadline.
- **Creator cap**: creators are limited to 10% of total pool per outcome to prevent manipulation.
- **Relayer idempotency**: duplicate relay submissions for the same intent are deduplicated deterministically.

## Release gating (before production)

1. External smart contract audit
2. Jurisdiction-specific legal review
3. Production secrets management (KMS / HSM for oracle key)
4. Rate limiting and DDoS protection
5. Monitoring and alerting setup
6. Load testing
