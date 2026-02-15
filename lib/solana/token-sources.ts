import axios from "axios";
import type { TokenListItem } from "@/types/token";

type JupiterToken = {
  address: string;
  symbol?: string;
  name?: string;
  logoURI?: string;
};

let cachedTokens: JupiterToken[] | null = null;
let cachedAt = 0;

async function getJupiterTokenList(): Promise<JupiterToken[]> {
  const now = Date.now();
  if (cachedTokens && now - cachedAt < 1000 * 60 * 30) return cachedTokens;

  const { data } = await axios.get<JupiterToken[]>("https://token.jup.ag/strict");
  cachedTokens = data;
  cachedAt = now;
  return data;
}

async function getJupiterPrices(mints: string[]): Promise<Record<string, number>> {
  if (!mints.length) return {};
  const base = process.env.JUPITER_PRICE_API || "https://price.jup.ag/v6";

  const { data } = await axios.get(`${base}/price`, {
    params: { ids: mints.join(",") },
  });

  const out: Record<string, number> = {};
  for (const mint of mints) {
    const p = data?.data?.[mint]?.price;
    if (typeof p === "number") out[mint] = p;
  }
  return out;
}

export async function getTokenPage(params: {
  q?: string;
  limit?: number;
  offset?: number;
}): Promise<{ items: TokenListItem[]; total: number }> {
  const { q, limit = 50, offset = 0 } = params;

  const list = await getJupiterTokenList();
  const query = (q || "").trim().toLowerCase();

  const filtered = query
    ? list.filter((t) => {
        const mint = t.address.toLowerCase();
        const sym = (t.symbol || "").toLowerCase();
        const name = (t.name || "").toLowerCase();
        return mint.includes(query) || sym.includes(query) || name.includes(query);
      })
    : list;

  const page = filtered.slice(offset, offset + limit);
  const mints = page.map((t) => t.address);
  const priceMap = await getJupiterPrices(mints);

  const items: TokenListItem[] = page.map((t) => ({
    mint: t.address,
    symbol: t.symbol,
    name: t.name,
    logoURI: t.logoURI,
    price: priceMap[t.address],
  }));

  return { items, total: filtered.length };
}
