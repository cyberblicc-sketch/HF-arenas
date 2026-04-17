import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    app: "HuggyDual / HF-Arenas",
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0-pre",
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? "development",
    region: process.env.VERCEL_REGION ?? "local",
    timestamp: new Date().toISOString(),
    services: {
      oracle: "operational",
      markets: "pre-launch",
      yields: "pre-launch",
      settlements: "pre-launch",
    },
  });
}
