"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { isValidMintClient } from "@/lib/solana/validate-client";
import { Search } from "lucide-react";

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
    <div className="rounded-2xl border border-border bg-card/60 p-5 md:p-7">
      <div className="text-sm text-muted-foreground">Paste a mint address to jump straight to a token.</div>

      <div className="mt-4 flex flex-col gap-2 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder="Mint / symbol / name…"
            className="h-11 pl-9"
          />
        </div>
        <Button size="lg" onClick={go} className="h-11">
          {isMint ? "Open Token" : "Search Directory"}
        </Button>
      </div>

      <div className="mt-3 text-xs text-muted-foreground">
        Tip: If you paste a valid Solana mint, you’ll go to the token page. Otherwise we search the directory.
      </div>
    </div>
  );
}
