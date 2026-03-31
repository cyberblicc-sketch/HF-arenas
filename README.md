# HF-arenas

HF arenas — crypto-native prediction markets for Hugging Face models, datasets, and Spaces.

## What this repo is

THE ARENA // HF TOP is a compile-ready monorepo for:
- Solidity market contracts
- NestJS relayer and compliance services
- Indexer / subgraph scaffolding
- Prisma schema and migrations
- Production config examples
- Operational and audit handoff docs

## Current status

Pre-production engineering scaffold. Useful for implementation, review, and build-out, but not a substitute for:
- successful compilation and tests
- external smart contract audit
- jurisdiction-specific legal review
- production secrets management and deployment hardening

## Included

- `apps/relayer`
- `apps/indexer`
- `packages/contracts`
- `packages/shared-prisma`
- `prisma`
- `subgraph`
- `config`
- `docs`

## Recommended launch fee defaults

- Protocol: 2.75%
- Creator: 1.00%
- Referral: 0.50%
- Dispute reserve: 0.75%
- Total default fee: 5.00%

## Environment configuration

Copy `.env.example` to `.env` and replace every placeholder before running anything.

> ⚠️ **Critical**: The following values in `.env.example` are **placeholders** and must be replaced before deployment or you will have a broken/insecure setup:
>
> | Variable | Placeholder value | Action required |
> |---|---|---|
> | `ADMIN_ADDRESS` | `0x0000000000000000000000000000000000000001` | Replace with your real admin/multisig wallet address |
> | `REGISTRY_ADDRESS` | `0x0000000000000000000000000000000000000000` | Replace with the deployed `ArenaRegistry` contract address |
> | `ORACLE_PRIVATE_KEY` | `REPLACE_WITH_ORACLE_KEY` | Replace with a real private key (use a hardware wallet or KMS in production) |
> | `PRIVATE_KEY` | `REPLACE_WITH_DEPLOYER_KEY` | Replace with your deployer private key |
> | `RPC_URL` | `https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY` | Replace `YOUR_KEY` with a real Alchemy (or equivalent) API key |
>
> Never commit a `.env` file with real secrets to version control.

## Next steps

1. Install dependencies: `pnpm install`
2. Install Foundry contract dependencies: `forge install --root packages/contracts`
3. Run Prisma migrations: `pnpm --dir prisma run migrate`
4. Compile and test contracts: `forge test --root packages/contracts`
5. Type-check relayer and indexer: `pnpm run typecheck`
6. Build subgraph against final deployed addresses
7. Complete external audit and legal localization
