import { NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 60;

/**
 * Cron: 15-minute settlement processor
 * Schedule: *\/15 * * * *
 * Processes pending on-chain settlement transactions for resolved markets.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    console.log("[cron:process-settlements] Processing pending settlements");

    // TODO: query settlements with status = 'pending'
    // TODO: batch-submit on-chain settlement TXs via relayer
    // TODO: update settlement status and notify users
    // TODO: reconcile treasury balances

    const settled = 0;
    const failed = 0;
    const elapsed = Date.now() - startedAt;

    console.log(
      `[cron:process-settlements] Settled ${settled}, failed ${failed} in ${elapsed}ms`
    );

    return NextResponse.json({
      ok: true,
      settled,
      failed,
      elapsedMs: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron:process-settlements] Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
