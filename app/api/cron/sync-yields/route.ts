import { NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 120;

/**
 * Cron: Daily yield accrual sync
 * Schedule: 0 0 * * *
 * Calculates and distributes 4.7% APY yield to all position holders.
 * Sources yield from Aave/Compound treasury float.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    console.log("[cron:sync-yields] Starting daily yield accrual");

    // TODO: query all active positions from DB
    // TODO: compute daily yield = position_size * (APY / 365)
    // TODO: credit yield to user balances
    // TODO: update TVL metrics and emit accounting events
    // TODO: post summary to monitoring webhook

    const dailyApy = parseFloat(process.env.YIELD_APY_RATE ?? "4.7") / 100;
    const dailyRate = dailyApy / 365;

    const processedAccounts = 0;
    const totalYieldDistributed = 0;
    const elapsed = Date.now() - startedAt;

    console.log(
      `[cron:sync-yields] Distributed $${totalYieldDistributed.toFixed(2)} to ${processedAccounts} accounts (daily rate: ${(dailyRate * 100).toFixed(6)}%) in ${elapsed}ms`
    );

    return NextResponse.json({
      ok: true,
      dailyRatePct: (dailyRate * 100).toFixed(6),
      processedAccounts,
      totalYieldDistributed,
      elapsedMs: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron:sync-yields] Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
