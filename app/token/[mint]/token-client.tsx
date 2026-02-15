"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { TokenChart } from "@/components/token/token-chart";
import { Button } from "@/components/ui/button";
import { Globe, Send, MessageCircle, Twitter, Copy, ExternalLink, LineChart, ShoppingCart } from "lucide-react";
import { SubmitInfoDialog } from "@/components/token/submit-info-dialog";

export default function TokenClient({ mint }: { mint: string }) {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/api/token/${mint}`);
        setData(res.data);
      } catch (e: any) {
        setErr(e?.response?.data?.error || "Failed to load token");
      }
    })();
  }, [mint]);

  const meta = data?.user_metadata;

  const pumpfunUrl = `https://pump.fun/coin/${mint}`;
  const raydiumUrl = `https://raydium.io/swap/?inputMint=sol&outputMint=${mint}`;
  const jupiterUrl = `https://jup.ag/swap`;
  const solscanUrl = `https://solscan.io/token/${mint}`;
  const dexScreenerSearchUrl = `https://dexscreener.com/solana/${mint}`;

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold">Token</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <code className="break-all rounded-lg border border-border bg-card px-2 py-1 text-xs text-muted-foreground">
                {mint}
              </code>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(mint)}
                className="gap-2"
              >
                <Copy className="h-4 w-4" /> Copy
              </Button>

              <Button asChild variant="outline" size="sm" className="gap-2">
                <a href={solscanUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" /> Solscan
                </a>
              </Button>
            </div>

            {/* Action buttons row (PoorScreener vibe) */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm" className="gap-2">
                <a href={pumpfunUrl} target="_blank" rel="noreferrer">
                  <LineChart className="h-4 w-4" /> Pump.fun
                </a>
              </Button>

              <Button asChild variant="outline" size="sm" className="gap-2">
                <a href={raydiumUrl} target="_blank" rel="noreferrer">
                  <ShoppingCart className="h-4 w-4" /> Raydium
                </a>
              </Button>

              <Button asChild variant="outline" size="sm" className="gap-2">
                <a href={jupiterUrl} target="_blank" rel="noreferrer">
                  <ShoppingCart className="h-4 w-4" /> Jupiter
                </a>
              </Button>

              <Button asChild variant="outline" size="sm" className="gap-2">
                <a href={dexScreenerSearchUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" /> DexScreener
                </a>
              </Button>

              {meta?.twitter_url && (
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <a href={meta.twitter_url} target="_blank" rel="noreferrer">
                    <Twitter className="h-4 w-4" /> X
                  </a>
                </Button>
              )}

              {meta?.telegram_url && (
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <a href={meta.telegram_url} target="_blank" rel="noreferrer">
                    <Send className="h-4 w-4" /> Telegram
                  </a>
                </Button>
              )}

              <SubmitInfoDialog defaultMint={mint} triggerLabel="Update Profile" />
            </div>
          </div>

          <Card className="p-4 md:min-w-[240px]">
            <div className="text-sm text-muted-foreground">Price</div>
            <div className="text-2xl font-semibold tabular-nums">
              {typeof data?.price === "number" ? `$${data.price.toFixed(6)}` : "—"}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Tip: Use “Copy” and paste into Jupiter if needed.
            </div>
          </Card>
        </div>

        {err && <p className="mt-4 text-sm text-red-500">{err}</p>}

        <div className="mt-5 grid gap-4">
          <TokenChart mint={mint} />

          <Card className="p-4">
            <div className="text-sm font-medium">Community / Socials</div>
            <div className="mt-3 grid gap-2 text-sm">
              <SocialRow icon={<Globe className="h-4 w-4" />} label="Website" url={meta?.website_url} />
              <SocialRow icon={<Twitter className="h-4 w-4" />} label="X" url={meta?.twitter_url} />
              <SocialRow icon={<Send className="h-4 w-4" />} label="Telegram" url={meta?.telegram_url} />
              <SocialRow icon={<MessageCircle className="h-4 w-4" />} label="Discord" url={meta?.discord_url} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              To add or update socials, use “Update Profile”.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}

function SocialRow({ icon, label, url }: { icon: React.ReactNode; label: string; url?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      {url ? (
        <a className="truncate max-w-[60%] text-sm underline" href={url} target="_blank" rel="noreferrer">
          {url}
        </a>
      ) : (
        <span className="text-muted-foreground">—</span>
      )}
    </div>
  );
}
