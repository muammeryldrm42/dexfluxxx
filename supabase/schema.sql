create extension if not exists "pgcrypto";

create table if not exists public.token_metadata (
  id uuid primary key default gen_random_uuid(),
  mint_address text not null unique,
  website_url text,
  twitter_url text,
  telegram_url text,
  discord_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create index if not exists idx_token_metadata_mint on public.token_metadata (mint_address);

alter table public.token_metadata
  add constraint website_url_format
  check (website_url is null or website_url ~* '^https?://'),
  add constraint twitter_url_format
  check (twitter_url is null or twitter_url ~* '^https?://'),
  add constraint telegram_url_format
  check (telegram_url is null or telegram_url ~* '^https?://'),
  add constraint discord_url_format
  check (discord_url is null or discord_url ~* '^https?://');
