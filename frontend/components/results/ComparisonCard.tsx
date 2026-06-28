import { formatCurrency } from '@/utils/formatCurrency';

interface ComparisonCardProps {
  label: string;
  description: string;
  value: number;
  variant: 'alternate' | 'real';
}

export default function ComparisonCard({ label, description, value, variant }: ComparisonCardProps) {
  const isAlternate = variant === 'alternate';

  const labelColor  = isAlternate ? 'text-alternate' : 'text-real';
  const icon        = isAlternate ? '✧'              : '◌';

  return (
    <div
      className="flex flex-col gap-3 p-8 rounded-3xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-foreground/10"
      role="region"
      aria-label={label}
    >
      <div className="flex items-center gap-2">
        <span className={`text-xl ${labelColor}`} role="img" aria-label={label}>{icon}</span>
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${labelColor}`}>{label}</p>
      </div>
      <p
        className="text-4xl font-black text-foreground tabular-nums tracking-tighter"
        aria-live="polite"
      >
        {formatCurrency(value)}
      </p>
      <p className="text-xs text-foreground/40 leading-relaxed mt-auto italic font-medium">
        {description}
      </p>
    </div>
  );
}
