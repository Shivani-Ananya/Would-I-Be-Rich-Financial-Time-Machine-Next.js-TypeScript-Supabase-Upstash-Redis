import { ScenarioCategory } from '@/types/scenario.types';

export interface CategoryMeta {
  id: ScenarioCategory | 'all';
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export const CATEGORY_META: CategoryMeta[] = [
  { id: 'all',          label: 'All',           emoji: '🌐', color: 'text-foreground',   bgColor: 'bg-card' },
  { id: 'crypto',       label: 'Crypto',         emoji: '₿',  color: 'text-white',       bgColor: 'bg-orange-600' },
  { id: 'spending',     label: 'Spending',        emoji: '☕',  color: 'text-white',       bgColor: 'bg-amber-600' },
  { id: 'real_estate',  label: 'Real Estate',     emoji: '🏡', color: 'text-white',       bgColor: 'bg-blue-600' },
  { id: 'stocks',       label: 'Stocks',          emoji: '📈', color: 'text-white',       bgColor: 'bg-emerald-600' },
  { id: 'life',         label: 'Life Decisions',  emoji: '🎯', color: 'text-white',       bgColor: 'bg-indigo-600' },
  { id: 'debt',         label: 'Debt',            emoji: '💳', color: 'text-white',       bgColor: 'bg-rose-600' },
  { id: 'macro',        label: 'Macro Events',    emoji: '🌍', color: 'text-white',       bgColor: 'bg-sky-600' },
];

export function getCategoryMeta(id: ScenarioCategory | 'all'): CategoryMeta {
  return CATEGORY_META.find(c => c.id === id) ?? CATEGORY_META[0];
}
