import TokenClient from "./token-client";

export default async function TokenPage({ params }: { params: Promise<{ mint: string }> }) {
  const { mint } = await params;
  return <TokenClient mint={mint} />;
}
