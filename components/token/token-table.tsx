import Link from "next/link";
import type { TokenListItem, TokenMetadataRow } from "@/types/token";
import { Card } from "@/components/ui/card";
import { Globe, Send, MessageCircle, Twitter } from "lucide-react";

export function TokenTable({
  items,
  metadataMap,
}: {
  items: TokenListItem[];
  metadataMap?: Record<string, TokenMetadataRow | null>;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-12 gap-2 border-b border-border px-4 py-3 text-xs text-muted-foreground">
        <div className="col-span-6 md:col-span-4">Token</div>
        <div className="hidden md:col-span-5 md:block">Mint</div>
        <div className="col-span-3 md:col-span-1">Symbol</div>
        <div className="col-span-3 md:col-span-2 text-right">Price</div>
      </div>

      <div className="divide-y divide-border">
        {items.map((t) => {
          const meta = metadataMap ? metadataMap[t.mint] : null;
          const hasAny =
            !!meta?.website_url || !!meta?.twitter_url || !!meta?.telegram_url || !!meta?.discord_url;

          return (
            <Link key={t.mint} href={`/token/${t.mint}`} className="block hover:bg-muted/40 transition">
              <div className="grid grid-cols-12 gap-2 px-4 py-3">
                <div className="col-span-6 md:col-span-4 flex items-center gap-3 min-w-0">
                  {t.logoURI ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.logoURI} alt="" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-medium">{t.name || "Unknown"}</div>
                      {hasAny && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          socials
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-muted-foreground md:hidden">{t.mint}</div>
                  </div>
                </div>

                <div className="hidden md:col-span-5 md:block">
                  <div className="truncate text-xs text-muted-foreground">{t.mint}</div>
                </div>

                <div className="col-span-3 md:col-span-1 flex items-center">
                  <span className="text-sm">{t.symbol || "—"}</span>
                </div>

                <div className="col-span-3 md:col-span-2 flex items-center justify-end">
                  <span className="text-sm tabular-nums">
                    {typeof t.price === "number" ? `$${t.price.toFixed(6)}` : "—"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
