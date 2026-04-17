import { NextResponse } from "next/server";

export const runtime = "edge";
export const maxDuration = 60;

/**
 * Cron: Weekly Monday 9am waitlist digest
 * Schedule: 0 9 * * 1
 * Sends weekly product update emails to waitlist subscribers
 * and exports analytics to founders dashboard.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    console.log("[cron:waitlist-digest] Sending weekly digest");

    // TODO: query waitlist subscribers from DB
    // TODO: render weekly update email template
    // TODO: batch-send via Resend/SendGrid
    // TODO: track open/click rates
    // TODO: post weekly metrics to founders Slack channel

    const emailsSent = 0;
    const elapsed = Date.now() - startedAt;

    console.log(
      `[cron:waitlist-digest] Sent ${emailsSent} digest emails in ${elapsed}ms`
    );

    return NextResponse.json({
      ok: true,
      emailsSent,
      elapsedMs: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[cron:waitlist-digest] Error:", err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
