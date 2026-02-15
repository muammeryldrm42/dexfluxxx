export type TokenListItem = {
  mint: string;
  symbol?: string;
  name?: string;
  logoURI?: string;
  price?: number;
};

export type TokenMetadataRow = {
  mint_address: string;
  website_url: string | null;
  twitter_url: string | null;
  telegram_url: string | null;
  discord_url: string | null;
  created_at: string;
};
