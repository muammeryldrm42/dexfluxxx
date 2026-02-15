import { Navbar } from "@/components/layout/navbar";
import { HeroSearch } from "@/components/home/hero-search";
import { TrendingList } from "@/components/home/trending-list";

export default function HomePage() {
  return (
    <main className="grid-noise min-h-screen">
      <Navbar />

      <div className="relative mx-auto max-w-6xl px-4 py-8 md:py-10">
        <div className="mb-7 rounded-2xl border border-primary/30 bg-card/40 p-4 shadow-[0_0_24px_rgba(62,255,157,0.08)] backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Live Scanner Feed</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Find Solana gems before they run.</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Mint gir, direkt token ekranına geç. İsim / sembol yaz, tam dizinde ara. PoorScreener mantığı + Flux veri katmanı.
          </p>
        </div>

        <HeroSearch />
        <TrendingList />
      </div>
    </main>
  );
}
