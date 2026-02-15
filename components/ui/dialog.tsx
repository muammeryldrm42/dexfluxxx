"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DialogCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = React.createContext<DialogCtx | null>(null);

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  return <Ctx.Provider value={{ open, setOpen: onOpenChange }}>{children}</Ctx.Provider>;
}

export function DialogTrigger({ asChild, children }: { asChild?: boolean; children: React.ReactElement }) {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("DialogTrigger must be used within Dialog");
  const child = React.cloneElement(children, {
    onClick: (e: any) => {
      children.props.onClick?.(e);
      ctx.setOpen(true);
    },
  });
  return asChild ? child : child;
}

export function DialogContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("DialogContent must be used within Dialog");
  if (!ctx.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={() => ctx.setOpen(false)} />
      <div className={cn("relative z-10 w-[92vw] max-w-lg rounded-xl border border-border bg-card p-5 shadow-xl", className)}>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold">{children}</h2>;
}
