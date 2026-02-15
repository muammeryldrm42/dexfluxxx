"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidMintClient } from "@/lib/solana/validate-client";
import { Search, CornerDownLeft } from "lucide-react";

export function HeroSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const isMint = useMemo(() => isValidMintClient(q.trim()), [q]);

  function go() {
    const v = q.trim();
    if (!v) return;
    if (isMint) router.push(`/token/${v}`);
    else router.push(`/directory?q=${encodeURIComponent(v)}`);
  }

  return (
    <section className="rounded-2xl border border-border bg-card/60 p-5 shadow-[0_0_35px_rgba(67,213,146,0.08)] md:p-7">
      <div className="flex flex-wrap items-center gap-2">
        <Badge label="scan-mode" />
        <Badge label={isMint ? "mint-detected" : "directory-query"} highlight />
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder="Paste mint / symbol / token name"
            className="h-12 border-primary/30 bg-background/70 pl-9 font-mono text-sm"
          />
        </div>
        <Button size="lg" onClick={go} className="h-12 min-w-[180px] gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <CornerDownLeft className="h-4 w-4" />
          {isMint ? "Open Token" : "Search Board"}
        </Button>
      </div>

      <p className="mt-3 font-mono text-xs text-muted-foreground">Enter ↵ ile direkt git. Geçerli mint ise token ekranı, değilse arama tablosu.</p>
    </section>
  );
}

function Badge({ label, highlight }: { label: string; highlight?: boolean }) {
  return (
    <span
      className={[
        "rounded-md border px-2 py-1 font-mono text-[11px] uppercase tracking-wider",
        highlight ? "border-primary/45 bg-primary/10 text-primary" : "border-border bg-background/70 text-muted-foreground",
      ].join(" ")}
    >
      {label}
    </span>
  );
}
