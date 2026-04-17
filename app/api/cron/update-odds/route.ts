import { NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 60;

/**
 * Cron: Every 5-minute probability / odds refresh
 * Schedule: *\/5 * * * *
 * Re-prices all open TFI markets using AMM pricing curves.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    console.log("[cron:update-odds] Refreshing market probabilities");

    // TODO: fetch current liquidity positions from each TFI pool
    // TODO: recalculate LMSR / Uniswap-style AMM odds
    // TODO: write updated probabilities to DB cache
    // TODO: push websocket events to connected clients

    const updatedCount = 0;
    const elapsed = Date.now() - startedAt;

    console.log(
      `[cron:update-odds] Updated ${updatedCount} markets in ${elapsed}ms`
    );

    return NextResponse.json({
      ok: true,
      updated: updatedCount,
      elapsedMs: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron:update-odds] Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
