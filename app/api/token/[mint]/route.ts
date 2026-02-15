import { NextResponse } from "next/server";
import axios from "axios";
import { supabaseServer } from "@/lib/supabase/server";
import { isValidSolanaAddress } from "@/lib/solana/validate";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ mint: string }> }
) {
  const { mint } = await params;

  if (!isValidSolanaAddress(mint)) {
    return NextResponse.json({ error: "Invalid mint address" }, { status: 400 });
  }

  const base = process.env.JUPITER_PRICE_API || "https://price.jup.ag/v6";
  const priceRes = await axios.get(`${base}/price`, { params: { ids: mint } });
  const price = priceRes?.data?.data?.[mint]?.price ?? null;

  const supabase = supabaseServer();
  const { data: meta } = await supabase
    .from("token_metadata")
    .select("mint_address, website_url, twitter_url, telegram_url, discord_url, created_at, updated_at")
    .eq("mint_address", mint)
    .maybeSingle();

  return NextResponse.json({ mint, price, user_metadata: meta ?? null });
}
