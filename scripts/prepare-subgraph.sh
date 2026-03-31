#!/usr/bin/env bash
# prepare-subgraph.sh — Generate subgraph/subgraph.yaml from the
# template by substituting environment-variable placeholders for
# deployed contract addresses and start blocks.
#
# Required env vars (or sensible defaults for local dev):
#   REGISTRY_ADDRESS   — deployed ArenaRegistry proxy address
#   FACTORY_ADDRESS    — deployed ArenaFactory proxy address
#   REGISTRY_START_BLOCK — block at which ArenaRegistry was deployed
#   FACTORY_START_BLOCK  — block at which ArenaFactory was deployed
#
# Usage:
#   export REGISTRY_ADDRESS=0xABC...
#   export FACTORY_ADDRESS=0xDEF...
#   ./scripts/prepare-subgraph.sh
#
#   — or via Makefile —
#   make subgraph-prepare
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATE="$REPO_ROOT/subgraph/subgraph.template.yaml"
OUTPUT="$REPO_ROOT/subgraph/subgraph.yaml"

if [ ! -f "$TEMPLATE" ]; then
  echo "ERROR: template not found at $TEMPLATE"
  exit 1
fi

# Fall back to placeholder zeros when env vars are unset (safe for codegen).
: "${REGISTRY_ADDRESS:=0x0000000000000000000000000000000000000000}"
: "${FACTORY_ADDRESS:=0x0000000000000000000000000000000000000000}"
: "${REGISTRY_START_BLOCK:=0}"
: "${FACTORY_START_BLOCK:=0}"

export REGISTRY_ADDRESS FACTORY_ADDRESS REGISTRY_START_BLOCK FACTORY_START_BLOCK

if command -v envsubst &>/dev/null; then
  envsubst < "$TEMPLATE" > "$OUTPUT"
else
  # Fallback: use sed when envsubst is unavailable
  sed \
    -e "s|\${REGISTRY_ADDRESS}|${REGISTRY_ADDRESS}|g" \
    -e "s|\${FACTORY_ADDRESS}|${FACTORY_ADDRESS}|g" \
    -e "s|\${REGISTRY_START_BLOCK}|${REGISTRY_START_BLOCK}|g" \
    -e "s|\${FACTORY_START_BLOCK}|${FACTORY_START_BLOCK}|g" \
    "$TEMPLATE" > "$OUTPUT"
fi

echo "  ✓ subgraph.yaml generated"
echo "    REGISTRY_ADDRESS     = $REGISTRY_ADDRESS"
echo "    FACTORY_ADDRESS      = $FACTORY_ADDRESS"
echo "    REGISTRY_START_BLOCK = $REGISTRY_START_BLOCK"
echo "    FACTORY_START_BLOCK  = $FACTORY_START_BLOCK"
