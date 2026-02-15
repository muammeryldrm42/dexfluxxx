import { NextResponse } from "next/server";
import { isValidSolanaAddress } from "@/lib/solana/validate";

type DexPair = {
  pairAddress?: string;
  pairId?: string;
  liquidity?: { usd?: number };
  volume?: { h24?: number };
  dexId?: string;
  url?: string;
};

function pickBestPool(pairs: DexPair[]) {
  // Prefer highest liquidity, then highest 24h volume.
  const sorted = [...pairs].sort((a, b) => {
    const la = a?.liquidity?.usd ?? 0;
    const lb = b?.liquidity?.usd ?? 0;
    if (lb !== la) return lb - la;
    const va = a?.volume?.h24 ?? 0;
    const vb = b?.volume?.h24 ?? 0;
    return vb - va;
  });
  const best = sorted[0];
  const pool = best?.pairAddress || best?.pairId;
  return { pool, best };
}

function mapResolution(resolution: string) {
  // resolution -> { timeframe, aggregate }
  // Allowed aggregates per docs: minute: 1/5/15, hour: 1/4/12
  switch (resolution) {
    case "1m": return { timeframe: "minute", aggregate: 1 };
    case "5m": return { timeframe: "minute", aggregate: 5 };
    case "15m": return { timeframe: "minute", aggregate: 15 };
    case "1h": return { timeframe: "hour", aggregate: 1 };
    case "4h": return { timeframe: "hour", aggregate: 4 };
    default:   return { timeframe: "minute", aggregate: 15 };
  }
}

function computeLimit(range: string, resolution: string) {
  // range = 1H / 6H / 24H. limit based on candle size.
  const hours = range === "1H" ? 1 : range === "6H" ? 6 : 24;

  if (resolution === "1m") return Math.min(1000, hours * 60);
  if (resolution === "5m") return Math.min(1000, Math.ceil((hours * 60) / 5));
  if (resolution === "15m") return Math.min(1000, Math.ceil((hours * 60) / 15));
  if (resolution === "1h") return Math.min(1000, hours);
  if (resolution === "4h") return Math.min(1000, Math.ceil(hours / 4));
  return Math.min(1000, Math.ceil((hours * 60) / 15));
}

export async function GET(req: Request, { params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;

  if (!isValidSolanaAddress(mint)) {
    return NextResponse.json({ error: "Invalid mint address" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const resolution = (searchParams.get("res") || "15m").toLowerCase(); // 1m,5m,15m,1h,4h
  const range = (searchParams.get("range") || "24H").toUpperCase();    // 1H,6H,24H

  const { timeframe, aggregate } = mapResolution(resolution);
  const limit = computeLimit(range, resolution);

  // 1) Find pools for this mint from DexScreener
  const pairsRes = await fetch(`https://api.dexscreener.com/token-pairs/v1/solana/${mint}`, {
    // cache for 30s on Vercel edge/runtime
    next: { revalidate: 30 },
  });

  if (!pairsRes.ok) {
    return NextResponse.json({ error: "Failed to discover pools" }, { status: 502 });
  }

  const pairs = (await pairsRes.json()) as DexPair[];
  if (!Array.isArray(pairs) || pairs.length === 0) {
    return NextResponse.json({ error: "No pools found for this token" }, { status: 404 });
  }

  const { pool, best } = pickBestPool(pairs);
  if (!pool) {
    return NextResponse.json({ error: "Pool selection failed" }, { status: 500 });
  }

  // 2) Fetch OHLCV from GeckoTerminal public API (by pool)
  const url = new URL(`https://api.geckoterminal.com/api/v2/networks/solana/pools/${pool}/ohlcv/${timeframe}`);
  url.searchParams.set("aggregate", String(aggregate));
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("currency", "usd");
  // default excludes empty intervals (fine)

  const ohlcvRes = await fetch(url.toString(), { next: { revalidate: 30 } });
  if (!ohlcvRes.ok) {
    return NextResponse.json({ error: "Chart data unavailable" }, { status: 502 });
  }

  const payload = await ohlcvRes.json();

  const list: any[] =
    payload?.data?.attributes?.ohlcv_list ||
    payload?.data?.data?.attributes?.ohlcv_list ||
    [];

  const candles = (Array.isArray(list) ? list : [])
    .map((x: any[]) => ({
      time: x?.[0],
      open: x?.[1],
      high: x?.[2],
      low: x?.[3],
      close: x?.[4],
      volume: x?.[5],
    }))
    .filter((c: any) => typeof c.time === "number" && c.open != null);

  return NextResponse.json({
    mint,
    pool,
    dex: best?.dexId ?? null,
    pair_url: best?.url ?? null,
    res: resolution,
    range,
    candles,
  });
}
