'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { SimulationService } from '@/lib/api';
import ComparisonCard from '@/components/results/ComparisonCard';
import ResultChart from '@/components/results/ResultChart';
import ShareButton from '@/components/results/ShareButton';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatCurrency, formatGrowth } from '@/utils/formatCurrency';
import { getCategoryMeta } from '@/utils/categories';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/lib/uiStore';

interface ResultViewProps {
  resultId: string;
}

export default function ResultView({ resultId }: ResultViewProps) {
  const router = useRouter();
  const setSimulating = useUIStore((state) => state.setSimulating);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['simulation', resultId],
    queryFn: () => SimulationService.simulateScenario(resultId),
  });

  // Sync isSimulating store state with query loading state
  useEffect(() => {
    setSimulating(isLoading);
    // Cleanup on unmount or when loading finishes
    return () => setSimulating(false);
  }, [isLoading, setSimulating]);

  const result = data?.data;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-4 py-16 max-w-5xl mx-auto">
        {/* Skeleton is actually hidden behind the global overlay, 
            but kept for visual consistency if overlay fades quickly */}
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-10 w-2/3 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </main>
    );
  }

  if (isError || !result) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
        <span className="text-7xl mb-6" role="img" aria-label="broken time machine">⏱️💥</span>
        <h1 className="text-3xl font-bold text-white mb-3">Your time machine broke</h1>
        <p className="text-slate-400 mb-8">
          We couldn't find this simulation. The link may have expired or never existed.
        </p>
        <Link
          href="/scenarios"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-white font-semibold hover:bg-brand/90 transition-colors"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Browse Scenarios
        </Link>
      </main>
    );
  }

  const meta = getCategoryMeta(result.scenario.category);
  const GapIcon = result.is_positive ? TrendingUp : TrendingDown;
  const gapColor = result.is_positive ? 'text-emerald-400' : 'text-red-400';

  return (
    <main className="min-h-screen bg-background px-4 py-12 md:px-8 lg:px-16">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb nav */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/scenarios" className="hover:text-slate-300 transition-colors">Scenarios</Link>
          <span>/</span>
          <span className="text-slate-400">Result</span>
        </nav>

        {/* Category badge + title */}
        <div className="mb-8">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4 ${meta.bgColor} ${meta.color}`}>
            <span role="img" aria-label={meta.label}>{meta.emoji}</span>
            {meta.label}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            {result.scenario.title}
          </h1>
        </div>

        {/* ── Comparison Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <ComparisonCard
            label={result.alternate_you.label}
            description={result.alternate_you.description}
            value={result.alternate_you.value}
            variant="alternate"
          />
          <ComparisonCard
            label={result.real_you.label}
            description={result.real_you.description}
            value={result.real_you.value}
            variant="real"
          />

          {/* Gap card */}
          <div className="flex flex-col gap-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">The Gap</p>
            <div className={`flex items-center gap-2 ${gapColor}`}>
              <GapIcon size={20} aria-hidden="true" />
              <span className="text-2xl font-extrabold">
                {formatCurrency(result.difference, true)}
              </span>
            </div>
            <p className={`text-sm font-medium ${gapColor}`}>
              {formatGrowth(result.growth_pct)} growth
            </p>
            <p className="mt-auto text-xs text-slate-500 leading-relaxed italic">
              "{result.commentary}"
            </p>
          </div>
        </div>

        {/* ── Recharts Chart ── */}
        <div className="mb-8">
          <ResultChart chartData={result.chart_data} />
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <ShareButton resultId={result.result_id} />
          <Link
            href="/scenarios"
            className="
              inline-flex items-center gap-2 rounded-full border border-slate-700 px-6 py-3
              text-slate-400 font-semibold text-sm
              hover:border-slate-500 hover:text-white transition-all duration-200
            "
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Try Another Scenario
          </Link>
          <Link
            href="/custom"
            className="
              inline-flex items-center gap-2 rounded-full border border-brand/40 px-6 py-3
              text-brand font-semibold text-sm
              hover:bg-brand/10 transition-all duration-200
            "
          >
            Build My Own →
          </Link>
        </div>

      </div>
    </main>
  );
}
