import { createClient } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScenarioCategory =
  | 'crypto'
  | 'spending'
  | 'real_estate'
  | 'stocks'
  | 'life'
  | 'debt'
  | 'macro';

export type InvestmentType =
  | 'lump_sum'
  | 'recurring_dca'
  | 'real_estate'
  | 'inflation';

/** Mirrors the `scenarios` table schema in Supabase. */
export interface ScenarioRow {
  id: string;
  title: string;
  description: string;
  category: ScenarioCategory;
  icon: string;
  investmentType: InvestmentType;
  isActive: boolean;
  createdAt: string;
}

// ─── Client ───────────────────────────────────────────────────────────────────

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isValidUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

const finalUrl = isValidUrl(supabaseUrl) ? supabaseUrl! : 'https://placeholder.supabase.co';
const finalKey = supabaseAnonKey && supabaseAnonKey !== 'your-anon-key-here' ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase = createClient(finalUrl, finalKey);
