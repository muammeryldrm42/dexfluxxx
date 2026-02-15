import { NextResponse } from "next/server";
import { getTokenPage } from "@/lib/solana/token-sources";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
  const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10), 0);

  const result = await getTokenPage({ q, limit, offset });
  return NextResponse.json(result);
}
