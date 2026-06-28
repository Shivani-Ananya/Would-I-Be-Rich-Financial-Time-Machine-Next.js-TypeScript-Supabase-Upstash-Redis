'use client';

import { ScenarioCategory } from '@/types/scenario.types';
import { CATEGORY_META, CategoryMeta } from '@/utils/categories';

interface CategoryFilterProps {
  selected: ScenarioCategory | 'all';
  onChange: (cat: ScenarioCategory | 'all') => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORY_META.map((cat: CategoryMeta) => {
        const isActive = selected === cat.id;
        return (
          <button
            key={cat.id}
            id={`category-filter-${cat.id}`}
            onClick={() => onChange(cat.id as ScenarioCategory | 'all')}
            aria-pressed={isActive}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest
              border transition-all duration-300 cursor-pointer
              ${isActive
                ? `${cat.bgColor} ${cat.color} border-transparent scale-105 shadow-xl shadow-current/20`
                : 'bg-card/50 text-foreground/40 border-border hover:border-brand/40 hover:text-foreground hover:bg-card'
              }
            `}
          >
            <span className="text-base" role="img" aria-label={cat.label}>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
