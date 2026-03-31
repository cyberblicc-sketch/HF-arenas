#!/usr/bin/env bash
# sync-abis.sh — Extract ABI arrays from Foundry compiled artifacts
# into the subgraph/abis/ directory so that `graph codegen` and
# `graph build` use the latest contract interfaces.
#
# Usage:  ./scripts/sync-abis.sh          (run from repo root)
#         make abi-sync                    (via Makefile)
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ARTIFACTS_DIR="$REPO_ROOT/packages/contracts/out"
ABI_DIR="$REPO_ROOT/subgraph/abis"

CONTRACTS=(ArenaRegistry ArenaFactory ArenaMarket)

if [ ! -d "$ARTIFACTS_DIR" ]; then
  echo "ERROR: Foundry output directory not found at $ARTIFACTS_DIR"
  echo "       Run 'forge build' inside packages/contracts first."
  exit 1
fi

mkdir -p "$ABI_DIR"

for contract in "${CONTRACTS[@]}"; do
  src="$ARTIFACTS_DIR/${contract}.sol/${contract}.json"
  dest="$ABI_DIR/${contract}.json"

  if [ ! -f "$src" ]; then
    echo "WARNING: artifact not found — $src (skipping)"
    continue
  fi

  # Foundry artifacts contain { abi: [...], bytecode: {...}, ... }.
  # The Graph only needs the abi array.
  if command -v jq &>/dev/null; then
    jq '.abi' "$src" > "$dest"
  else
    # Fallback: use Node.js if jq is unavailable
    node -e "
      const fs = require('fs');
      const [,, s, d] = process.argv;
      const artifact = JSON.parse(fs.readFileSync(s, 'utf8'));
      fs.writeFileSync(d, JSON.stringify(artifact.abi, null, 2) + '\n');
    " "$src" "$dest"
  fi

  echo "  ✓ ${contract}.json → subgraph/abis/"
done

echo "ABI sync complete."
