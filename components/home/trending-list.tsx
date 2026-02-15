"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { TokenListItem } from "@/types/token";

type TrendingItem = TokenListItem & {
  volume24hUSD?: number;
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
    <section className="mt-6">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="font-mono text-sm uppercase tracking-[0.2em] text-primary">hot board</h2>
          <p className="text-xs text-muted-foreground">24h trend stream. Click row to open token terminal.</p>
        </div>
        <Link href="/directory" className="text-xs text-muted-foreground hover:text-primary hover:underline">
          Full directory →
        </Link>
      </div>

      {err ? (
        <p className="text-sm text-red-500">{err}</p>
      ) : (
        <Card className="overflow-hidden border-primary/20 bg-card/70">
          <div className="grid grid-cols-[64px,1fr,140px] border-b border-border bg-background/70 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span>rank</span>
            <span>token</span>
            <span className="text-right">price / vol</span>
          </div>

          <div className="divide-y divide-border/70">
            {items.slice(0, 15).map((t, idx) => (
              <Link key={t.mint} href={`/token/${t.mint}`} className="grid grid-cols-[64px,1fr,140px] items-center gap-2 px-4 py-3 transition hover:bg-primary/5">
                <span className="font-mono text-xs text-primary">#{idx + 1}</span>

                <div className="flex min-w-0 items-center gap-3">
                  {t.logoURI ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.logoURI} alt="" className="h-8 w-8 rounded-full border border-border" />
                  ) : (
                    <div className="h-8 w-8 rounded-full border border-border bg-muted" />
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{t.symbol || t.name || "Unknown"}</div>
                    <div className="truncate font-mono text-[11px] text-muted-foreground">{t.mint}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono text-sm tabular-nums">{typeof t.price === "number" ? `$${t.price.toFixed(6)}` : "—"}</div>
                  <div className="font-mono text-[11px] text-muted-foreground tabular-nums">
                    {typeof t.volume24hUSD === "number" ? `$${Math.round(t.volume24hUSD).toLocaleString()}` : "-"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </section>
  );
}
