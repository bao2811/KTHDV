import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ready",
    service: "web",
    timestamp: new Date().toISOString(),
  });
}
