-- ─── Would I Be Rich — Supabase Schema ──────────────────────────────────────
-- Run this SQL in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- https://supabase.com/dashboard/project/<your-project-id>/sql/new

-- Enable the pgcrypto extension for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ─── scenarios table ─────────────────────────────────────────────────────────
create table if not exists public.scenarios (
  id            uuid          primary key default gen_random_uuid(),
  title         text          not null,
  description   text          not null,
  category      text          not null
                  check (category in ('crypto','spending','real_estate','stocks','life','debt','macro')),
  icon          text          not null,
  "investmentType" text       not null
                  check ("investmentType" in ('lump_sum','recurring_dca','real_estate','inflation')),
  "isActive"    boolean       not null default true,
  "createdAt"   timestamptz   not null default now()
);

-- Row-Level Security (RLS) — public read, no anonymous writes
alter table public.scenarios enable row level security;

create policy "Allow public read of active scenarios"
  on public.scenarios
  for select
  using ("isActive" = true);

-- ─── Seed data (5 sample scenarios) ─────────────────────────────────────────
insert into public.scenarios (title, description, category, icon, "investmentType", "isActive")
values
  (
    'Bitcoin 2015',
    'What if you had invested $1,000 in Bitcoin back in January 2015 when it was trading around $275?',
    'crypto', '₿', 'lump_sum', true
  ),
  (
    'Coffee Money',
    'What if you had invested your daily coffee budget (~$5/day) into an S&P 500 index fund instead of drinking it?',
    'spending', '☕', 'recurring_dca', true
  ),
  (
    'Gold Investment',
    'What if you had put ₹1,00,000 into gold in 2010? Gold has historically been a safe-haven asset against inflation.',
    'macro', '🥇', 'lump_sum', true
  ),
  (
    'Nifty 50',
    'What if you had invested ₹10,000/month into a Nifty 50 index fund starting in 2015 through a systematic investment plan?',
    'stocks', '📈', 'recurring_dca', true
  ),
  (
    'Real Estate',
    'What if you had bought a 2BHK apartment in Bangalore in 2012 for ₹45 lakhs instead of renting?',
    'real_estate', '🏠', 'real_estate', true
  );
