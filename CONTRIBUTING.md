# Contributing to HF-arenas

Thank you for your interest in contributing! Please read this guide before opening issues or pull requests.

## Getting Started

1. **Fork** the repository and clone your fork.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Install Foundry for contract development:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```
4. Install contract dependencies:
   ```bash
   cd packages/contracts && forge install
   ```

## Development Workflow

- **Contracts** live in `packages/contracts/src/`. Run tests with:
  ```bash
  forge test --root packages/contracts
  ```
- **Relayer / Indexer** live in `apps/`. Run TypeScript checks with:
  ```bash
  pnpm run typecheck
  ```
- **Subgraph** lives in `subgraph/`. Build with:
  ```bash
  pnpm --dir subgraph run build
  ```

## Pull Request Guidelines

1. One logical change per PR — keep diffs focused.
2. All Forge tests must pass (`forge test --root packages/contracts`).
3. TypeScript must type-check cleanly (`pnpm run typecheck`).
4. Follow the existing code style (Solidity `0.8.26`, NestJS conventions).
5. Add or update tests for any new contract logic.
6. Do **not** commit real private keys, API keys, or secrets — use `.env.example` as a template.

## Reporting Security Issues

Please **do not** open a public GitHub issue for security vulnerabilities. Instead, email the maintainers directly. We will respond within 72 hours.

## Code of Conduct

Be respectful. Harassment or abusive behavior will result in a ban.
