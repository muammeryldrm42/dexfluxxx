import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const key = process.env.BIRDEYE_API_KEY;

  // If Birdeye key exists, use Birdeye trending list (better UX).
  if (key) {
    try {
      const { data } = await axios.get("https://public-api.birdeye.so/defi/token_trending", {
        params: { sort_by: "rank", sort_type: "asc", offset: 0, limit: 20 },
        headers: {
          accept: "application/json",
          "x-chain": "solana",
          "X-API-KEY": key,
        },
        timeout: 10_000,
      });

      const tokens = data?.data?.tokens || [];
      const items = tokens.map((t: any) => ({
        mint: t.address,
        name: t.name,
        symbol: t.symbol,
        logoURI: t.logoURI,
        price: t.price,
        volume24hUSD: t.volume24hUSD,
        liquidity: t.liquidity,
        rank: t.rank,
      }));

      return NextResponse.json({ items, source: "birdeye" });
    } catch (e: any) {
      // fall through to safe fallback
    }
  }

  // Fallback: return a slice of Jupiter token list without requiring keys.
  const { data } = await axios.get("https://token.jup.ag/strict", { timeout: 10_000 });
  const items = (data || []).slice(0, 20).map((t: any) => ({
    mint: t.address,
    name: t.name,
    symbol: t.symbol,
    logoURI: t.logoURI,
  }));

  return NextResponse.json({ items, source: "jupiter_fallback" });
}
