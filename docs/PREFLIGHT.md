# Pre-launch Preflight Checklist

Final checklist before production deployment of The Arena HF TOP.

---

## 1. Smart Contracts

- [ ] Install Foundry deps: `cd packages/contracts && forge install`
- [ ] `forge build` compiles without errors
- [ ] `forge test -vvv` — all tests pass
- [ ] Fee constants match launch schedule:
  - `protocolFeeBps = 275` (2.75%)
  - `creatorFeeBps = 100` (1.00%)
  - `referralFeeBps = 50` (0.50%)
  - `disputeReserveBps = 75` (0.75%)
  - Total = 500 bps (5.00%)
- [ ] External audit completed and findings addressed
- [ ] Deployment script (`Deploy.s.sol`) reviewed
- [ ] Admin / Operator / Oracle roles documented and assigned
- [ ] Multisig set for DEFAULT_ADMIN_ROLE (not EOA in production)

## 2. Relayer

- [ ] All required env vars present (see `apps/relayer/src/main.ts` `validateEnvironment`)
- [ ] `pnpm --dir apps/relayer run build` succeeds
- [ ] Health endpoint returns `200 OK` at `/api/health`
- [ ] Swagger UI loads at `/api/docs`
- [ ] Gelato sponsoredCallERC2771 tested on testnet
- [ ] Oracle EIP-712 signature verified against on-chain `ArenaMarket.placeBet()`
- [ ] Idempotency verified: duplicate submit returns cached result
- [ ] Rate limiting configured (reverse proxy or NestJS throttler)
- [ ] CORS policy configured for production frontend origin

## 3. Compliance

- [ ] TRM Labs or Chainalysis API key configured and tested
- [ ] Fail-closed behavior verified: sanctions provider error → address blocked
- [ ] SumSub KYC webhook HMAC verified with production secret
- [ ] Webhook endpoint reachable from SumSub infrastructure
- [ ] Sanctions cache TTL acceptable (currently 60 minutes)

## 4. Database

- [ ] `DATABASE_URL` points to production PostgreSQL instance
- [ ] `pnpm prisma:migrate` applies cleanly
- [ ] Indexes verified on high-query tables (Market.status, RelayedTransaction.status)
- [ ] Backups configured
- [ ] Connection pooling configured (PgBouncer or similar)

## 5. Indexer

- [ ] `SUBGRAPH_URL` set to deployed subgraph endpoint
- [ ] `pnpm --dir apps/indexer run build` succeeds
- [ ] Sync service starts and syncs from subgraph
- [ ] Health endpoint returns `200 OK` at `/api/health`

## 6. Subgraph

- [ ] Replace placeholder addresses in `subgraph.yaml` with deployed contract addresses
- [ ] Set `startBlock` to deployment block number (not 0)
- [ ] Refresh ABI files from `forge build` output
- [ ] `pnpm --dir subgraph run codegen` succeeds
- [ ] `pnpm --dir subgraph run build` succeeds
- [ ] Deploy to The Graph Studio or hosted service
- [ ] Verify subgraph indexes events correctly on testnet

## 7. Infrastructure

- [ ] Docker Compose credentials replaced with strong secrets
- [ ] Health checks verified for all services
- [ ] TLS/HTTPS configured (reverse proxy)
- [ ] Monitoring and alerting configured
- [ ] Log aggregation configured
- [ ] Redis password set (if exposed)
- [ ] Database ports not exposed to public internet

## 8. Secrets Management

- [ ] `ORACLE_PRIVATE_KEY` stored in KMS / HSM (not plaintext env var)
- [ ] `GELATO_API_KEY` stored in secrets manager
- [ ] All `REPLACE_WITH_*` placeholders replaced
- [ ] `.env` file not committed to version control
- [ ] Secret rotation procedure documented

## 9. Legal & Compliance

- [ ] Jurisdiction-specific legal review completed
- [ ] Terms of service finalized
- [ ] Privacy policy finalized
- [ ] KYC/AML requirements documented per jurisdiction
- [ ] Restricted jurisdictions list configured

## 10. Final Verification

- [ ] Full `make bootstrap` passes on clean checkout
- [ ] End-to-end flow tested: create market → place bet → resolve → claim
- [ ] Voided market refund flow tested
- [ ] Fee distribution verified (treasury, creator, referrer)
- [ ] Challenge window and dispute flow tested
- [ ] Load testing completed
- [ ] Incident response runbook prepared
