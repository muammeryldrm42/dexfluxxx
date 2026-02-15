import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { isValidSolanaAddress } from "@/lib/solana/validate";
import { SubmitSchema } from "@/lib/validators/submit";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = SubmitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { mint, website_url, twitter_url, telegram_url, discord_url } = parsed.data;

  if (!isValidSolanaAddress(mint)) {
    return NextResponse.json({ error: "Invalid mint address" }, { status: 400 });
  }

  const supabase = supabaseServer();

  // Partial upsert: only update fields that were actually provided.
  // This allows:
  // - mint-only submissions (creates a row)
  // - updating only X or only website without wiping existing data
  const payload: Record<string, any> = { mint_address: mint };
  payload.updated_at = new Date().toISOString();
  if (website_url !== undefined) payload.website_url = website_url;
  if (twitter_url !== undefined) payload.twitter_url = twitter_url;
  if (telegram_url !== undefined) payload.telegram_url = telegram_url;
  if (discord_url !== undefined) payload.discord_url = discord_url;

  const { data, error } = await supabase
    .from("token_metadata")
    .upsert(payload, { onConflict: "mint_address" })
    .select("mint_address, website_url, twitter_url, telegram_url, discord_url, created_at, updated_at")
    .single();

  if (error) {
    return NextResponse.json({ error: "DB error", details: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, row: data });
}
