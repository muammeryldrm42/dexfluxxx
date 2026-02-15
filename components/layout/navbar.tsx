import Link from "next/link";
import { SubmitInfoDialog } from "@/components/token/submit-info-dialog";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/50 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Dex Flux" className="h-9 w-9 rounded-xl border border-border" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-tight">Dex Flux</div>
            <div className="text-[11px] text-muted-foreground">Solana Screener + Directory</div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/directory">
            <Button variant="outline" size="sm">Directory</Button>
          </Link>
          <SubmitInfoDialog />
        </div>
      </div>
    </header>
  );
}
