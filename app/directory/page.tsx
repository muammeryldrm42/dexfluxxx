"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/layout/navbar";
import { Input } from "@/components/ui/input";
import { TokenTable } from "@/components/token/token-table";
import type { TokenListItem, TokenMetadataRow } from "@/types/token";
import { Filter, Search } from "lucide-react";

type FilterMode = "all" | "with_socials" | "missing_socials";

export default function DirectoryPage() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<TokenListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [mode, setMode] = useState<FilterMode>("all");
  const [metaMap, setMetaMap] = useState<Record<string, TokenMetadataRow | null>>({});
  const limit = 50;

  const debouncedQ = useDebouncedValue(q, 250);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQ(params.get("q") || "");
  }, []);

  useEffect(() => {
    setOffset(0);
  }, [debouncedQ]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await axios.get("/api/tokens", {
        params: { q: debouncedQ || undefined, limit, offset },
      });
      if (!mounted) return;
      setItems(data.items);
      setTotal(data.total);
    })().catch(() => {
      if (!mounted) return;
      setItems([]);
      setTotal(0);
    });

    return () => {
      mounted = false;
    };
  }, [debouncedQ, offset]);

  // Fetch socials for current page
  useEffect(() => {
    (async () => {
      const mints = items.map((x) => x.mint);
      if (!mints.length) return;
      const { data } = await axios.post("/api/metadata/batch", { mints });
      setMetaMap(data.map || {});
    })().catch(() => {});
  }, [items]);

  const filteredItems = useMemo(() => {
    if (mode === "all") return items;
    return items.filter((t) => {
      const meta = metaMap[t.mint];
      const hasAny = !!meta?.website_url || !!meta?.twitter_url || !!meta?.telegram_url || !!meta?.discord_url;
      return mode === "with_socials" ? hasAny : !hasAny;
    });
  }, [items, metaMap, mode]);

  const canPrev = offset > 0;
  const canNext = offset + limit < total;

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Directory</h1>
            <p className="text-sm text-muted-foreground">Search by name / symbol / mint. Filter by social coverage.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0"
              />
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
              <Filter className="ml-2 h-4 w-4 text-muted-foreground" />
              <button
                className={tabClass(mode === "all")}
                onClick={() => setMode("all")}
              >
                All
              </button>
              <button
                className={tabClass(mode === "with_socials")}
                onClick={() => setMode("with_socials")}
              >
                With socials
              </button>
              <button
                className={tabClass(mode === "missing_socials")}
                onClick={() => setMode("missing_socials")}
              >
                Missing
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <TokenTable items={filteredItems} metadataMap={metaMap} />
        </div>

        <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {Math.min(offset + 1, total)}–{Math.min(offset + limit, total)} of {total}
          </span>
          <div className="flex gap-2">
            <button className="rounded-lg border border-border px-3 py-1 disabled:opacity-40" disabled={!canPrev} onClick={() => setOffset((v) => Math.max(v - limit, 0))}>
              Prev
            </button>
            <button className="rounded-lg border border-border px-3 py-1 disabled:opacity-40" disabled={!canNext} onClick={() => setOffset((v) => v + limit)}>
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function tabClass(active: boolean) {
  return [
    "rounded-lg px-2.5 py-1 text-xs transition",
    active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60",
  ].join(" ");
}

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}
