import Link from "next/link";
import { Radar, Rows3 } from "lucide-react";
import { SubmitInfoDialog } from "@/components/token/submit-info-dialog";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex items-center gap-3">
          <div className="grid h-10 w-10 place-content-center rounded-md border border-primary/60 bg-primary/10 text-primary shadow-[0_0_20px_rgba(66,244,157,0.2)] transition group-hover:scale-105">
            <Radar className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-[0.14em] text-primary">DEXFLUXXX</div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">solana poor screener</div>
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
