import { NextResponse } from "next/server";

import { appEnv } from "@/lib/env";

export async function GET() {
  return NextResponse.json({
    ok: true,
    mode: appEnv.driver,
    timestamp: new Date().toISOString(),
  });
}
