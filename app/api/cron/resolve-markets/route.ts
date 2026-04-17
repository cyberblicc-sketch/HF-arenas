import { NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 300;

/**
 * Cron: Hourly market resolution check
 * Schedule: 0 * * * *
 * Queries AI oracle for resolved TFI markets and settles open positions.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    // Placeholder: In production this calls the oracle aggregator
    // and resolves any markets whose resolution time has passed.
    const resolvedMarkets: string[] = [];

    console.log("[cron:resolve-markets] Starting hourly resolution sweep");

    // TODO: query DB for markets with resolution_time <= now()
    // TODO: fetch oracle verdicts from Pyth / Chainlink / Hugging Face API
    // TODO: settle YES/NO positions and distribute yield

    const elapsed = Date.now() - startedAt;

    console.log(
      `[cron:resolve-markets] Done. Resolved ${resolvedMarkets.length} markets in ${elapsed}ms`
    );

    return NextResponse.json({
      ok: true,
      resolved: resolvedMarkets.length,
      elapsedMs: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron:resolve-markets] Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
