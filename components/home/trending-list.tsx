"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { TokenListItem } from "@/types/token";

type TrendingItem = TokenListItem & {
  volume24hUSD?: number;
  liquidity?: number;
  rank?: number;
};

export function TrendingList() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/api/trending");
        setItems(data.items || []);
      } catch (e: any) {
        setErr(e?.response?.data?.error || "Failed to load trending");
      }
    })();
  }, []);

  return (
    <div className="mt-6">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold">Trending</h2>
          <p className="text-xs text-muted-foreground">Birdeye trending (if API key set) — otherwise a safe fallback list.</p>
        </div>
        <Link href="/directory" className="text-xs text-muted-foreground hover:underline">Open full directory →</Link>
      </div>

      {err ? (
        <p className="text-sm text-red-500">{err}</p>
      ) : (
        <Card className="overflow-hidden">
          <div className="divide-y divide-border">
            {items.slice(0, 15).map((t) => (
              <Link key={t.mint} href={`/token/${t.mint}`} className="block px-4 py-3 hover:bg-muted/40 transition">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {t.logoURI ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.logoURI} alt="" className="h-8 w-8 rounded-full" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-muted" />
                    )}
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{t.name || "Unknown"}</div>
                      <div className="truncate text-xs text-muted-foreground">{t.symbol || "—"} • {t.mint}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm tabular-nums">{typeof t.price === "number" ? `$${t.price.toFixed(6)}` : "—"}</div>
                    <div className="text-[11px] text-muted-foreground tabular-nums">
                      {typeof t.volume24hUSD === "number" ? `Vol24h $${Math.round(t.volume24hUSD).toLocaleString()}` : " "}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
