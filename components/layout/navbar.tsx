import Link from "next/link";
import { Rows3 } from "lucide-react";
import { SubmitInfoDialog } from "@/components/token/submit-info-dialog";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Dex Flux" className="h-10 w-10 rounded-md border border-primary/40 bg-white object-cover p-0.5 shadow-[0_0_20px_rgba(66,244,157,0.2)]" />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-[0.14em] text-primary">DEX FLUX</div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">solana screener</div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/directory">
            <Button variant="outline" size="sm" className="gap-1 border-primary/40 bg-primary/5 text-primary hover:bg-primary/15">
              <Rows3 className="h-3.5 w-3.5" /> Board
            </Button>
          </Link>
          <SubmitInfoDialog />
        </div>
      </div>
    </header>
  );
}
