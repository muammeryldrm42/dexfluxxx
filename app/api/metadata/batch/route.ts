import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const mints: string[] = Array.isArray(body?.mints) ? body.mints : [];

  if (!mints.length) {
    return NextResponse.json({ map: {} });
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("token_metadata")
    .select("mint_address, website_url, twitter_url, telegram_url, discord_url, created_at")
    .in("mint_address", mints);

  if (error) {
    return NextResponse.json({ error: "DB error", details: error.message }, { status: 500 });
  }

  const map: Record<string, any> = {};
  for (const mint of mints) map[mint] = null;
  for (const row of data || []) map[row.mint_address] = row;

  return NextResponse.json({ map });
}
