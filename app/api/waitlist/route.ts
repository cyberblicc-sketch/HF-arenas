import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role, interest } = body as {
      email?: string;
      role?: string;
      interest?: string;
    };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Valid email required" },
        { status: 400 }
      );
    }

    // TODO: persist to Supabase / Neon waitlist table
    // TODO: send welcome email via Resend
    // TODO: add to ConvertKit / Loops sequence tagged by role

    console.log(`[api:waitlist] New signup: ${email} role=${role ?? "n/a"} interest=${interest ?? "n/a"}`);

    return NextResponse.json({
      ok: true,
      message: "You're on the list! We'll be in touch soon.",
      position: Math.floor(Math.random() * 200) + 800,
    });
  } catch (err) {
    console.error("[api:waitlist] Error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // TODO: return sanitised waitlist count for social proof
  return NextResponse.json({ count: 1024 });
}
