import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dex Flux",
  description: "Solana Token Directory — search tokens and submit socials for free.",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
