import { Navbar } from "@/components/layout/navbar";
import { HeroSearch } from "@/components/home/hero-search";
import { TrendingList } from "@/components/home/trending-list";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Dex Flux</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Poorscreener-style mint search + a full Solana token directory.
          </p>
        </div>

        <HeroSearch />
        <TrendingList />

        <div className="mt-10 text-xs text-muted-foreground">
          Prices: Jupiter. Trending + charts: Birdeye (optional). Community links: Supabase.
        </div>
      </div>
    </main>
  );
}
