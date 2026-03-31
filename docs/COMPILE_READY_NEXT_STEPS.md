# Compile-ready next steps

> **Quick start**: `make bootstrap` runs the full pipeline (steps 1-5).

## 1. Install dependencies
```bash
pnpm install                     # Node/TS packages
make forge-deps                  # Foundry libs (forge-std, OpenZeppelin)
```

## 2. Database
- set `DATABASE_URL` in `.env` (see `.env.example`)
```bash
make prisma                      # generate Prisma client
make prisma-migrate              # run migrations
```

## 3. Contracts
```bash
make contracts                   # forge build
make contracts-test              # forge test -vvv
```

## 4. ABI refresh & Subgraph
```bash
make abi-sync                    # copy compiled ABIs → subgraph/abis/
# set REGISTRY_ADDRESS, FACTORY_ADDRESS, *_START_BLOCK in .env
make subgraph-prepare            # generate subgraph.yaml from template
make subgraph-codegen            # graph codegen
make subgraph-build              # graph build
# — or all at once —
make subgraph                    # prepare + codegen + build
```

## 5. Backend
- type-check relayer and indexer (`make typecheck`)
- wire real env vars
- test Sumsub and sanctions adapters in staging

## 6. Release gating
- external contract audit
- legal localization
- secrets/KMS/multisig setup
