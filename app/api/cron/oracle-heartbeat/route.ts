import { NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 30;

/**
 * Cron: 2-minute AI oracle heartbeat / health check
 * Schedule: *\/2 * * * *
 * Pings the HuggingFace inference endpoints and on-chain oracle feeds
 * to ensure data freshness. Alerts on staleness.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    console.log("[cron:oracle-heartbeat] Pinging AI oracle sources");

    const checks: Record<string, "ok" | "stale" | "down"> = {};

    // Check HuggingFace API health
    if (process.env.HUGGINGFACE_API_KEY) {
      try {
        const hfRes = await fetch("https://huggingface.co/api/whoami", {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
          signal: AbortSignal.timeout(5000),
        });
        checks["huggingface"] = hfRes.ok ? "ok" : "stale";
      } catch {
        checks["huggingface"] = "down";
      }
    }

    // TODO: check Pyth Network price feeds
    // TODO: check Chainlink oracle freshness
    // TODO: check custom benchmark feeds (MMLU, HumanEval, MATH)
    // TODO: post alert to Slack/Discord webhook if any feed is down

    const elapsed = Date.now() - startedAt;
    const allOk = Object.values(checks).every((s) => s === "ok");

    console.log(`[cron:oracle-heartbeat] Status: ${JSON.stringify(checks)} in ${elapsed}ms`);

    return NextResponse.json({
      ok: allOk,
      checks,
      elapsedMs: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron:oracle-heartbeat] Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
