CREATE TABLE "SyncState" (
  "id" TEXT PRIMARY KEY,
  "lastBlock" BIGINT NOT NULL,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "SyncState_updatedAt_idx" ON "SyncState"("updatedAt");
