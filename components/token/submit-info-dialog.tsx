"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  defaultMint?: string;
  triggerLabel?: string;
  triggerClassName?: string;
};

export function SubmitInfoDialog({ defaultMint, triggerLabel = "Update Profile", triggerClassName }: Props) {
  const [open, setOpen] = useState(false);
  const [mint, setMint] = useState(defaultMint || "");
  const [website_url, setWebsite] = useState("");
  const [twitter_url, setTwitter] = useState("");
  const [telegram_url, setTelegram] = useState("");
  const [discord_url, setDiscord] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && defaultMint) setMint(defaultMint);
  }, [open, defaultMint]);

  async function onSubmit() {
    setErr(null);
    setLoading(true);
    try {
      await axios.post("/api/submit", { mint, website_url, twitter_url, telegram_url, discord_url });
      setOpen(false);

      if (defaultMint) {
        window.location.reload();
        return;
      }

      setMint("");
      setWebsite("");
      setTwitter("");
      setTelegram("");
      setDiscord("");
    } catch (e: any) {
      setErr(e?.response?.data?.error || "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className={triggerClassName}>{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update token profile (free)</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Mint Address</Label>
            <Input value={mint} onChange={(e) => setMint(e.target.value)} placeholder="Token mint address..." />
            <p className="text-xs text-muted-foreground">
              Mint is required. All links are optional — you can submit only the mint and update socials later.
            </p>
          </div>

          <div className="grid gap-2">
            <Label>Website</Label>
            <Input value={website_url} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
          </div>

          <div className="grid gap-2">
            <Label>X / Twitter</Label>
            <Input value={twitter_url} onChange={(e) => setTwitter(e.target.value)} placeholder="https://x.com/..." />
          </div>

          <div className="grid gap-2">
            <Label>Telegram</Label>
            <Input value={telegram_url} onChange={(e) => setTelegram(e.target.value)} placeholder="https://t.me/..." />
          </div>

          <div className="grid gap-2">
            <Label>Discord</Label>
            <Input value={discord_url} onChange={(e) => setDiscord(e.target.value)} placeholder="https://discord.gg/..." />
          </div>

          {err && <p className="text-sm text-red-500">{err}</p>}

          <Button disabled={loading} onClick={onSubmit}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
