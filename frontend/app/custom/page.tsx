'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCustomSimulation } from '@/hooks/useSimulation';
import { useUIStore } from '@/lib/uiStore';
import { TrendingUp, Loader2, AlertCircle } from 'lucide-react';

// ─── Zod Validation Schema ────────────────────────────────────────────────────
const TICKER_REGEX = /^[A-Z0-9.\-]{1,10}$/;
const MIN_DATE = new Date('2000-01-01');
const MAX_DATE = new Date();
MAX_DATE.setDate(MAX_DATE.getDate() - 1); // yesterday max

// Use z.preprocess for the number field so that RHF's inferred
// FormData type stays { asset: string; initial_amount: number; start_date: string }
// while still coercing string→number from the HTML input.
const customSimSchema = z.object({
  asset: z
    .string()
    .min(1, 'Ticker is required')
    .max(10, 'Max 10 characters')
    .transform((v) => v.toUpperCase().trim())
    .refine((v) => TICKER_REGEX.test(v), {
      message: 'Only letters, numbers, dots, and dashes (e.g. AAPL, BTC-USD)',
    }),
  initial_amount: z
    .number()
    .min(1, 'Minimum $1')
    .max(10_000_000, 'Maximum $10,000,000'),
  start_date: z
    .string()
    .min(1, 'Start date is required')
    .refine((d) => {
      const date = new Date(d);
      return !isNaN(date.getTime()) && date >= MIN_DATE && date <= MAX_DATE;
    }, {
      message: 'Date must be between Jan 2000 and yesterday',
    }),
});

type FormData = {
  asset: string;
  initial_amount: number;
  start_date: string;
};

// ─── Input Component ──────────────────────────────────────────────────────────
function FormField({
  label,
  id,
  hint,
  error,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] font-black uppercase tracking-widest text-foreground/60">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[10px] text-foreground/30 font-medium uppercase tracking-tight">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError: boolean) => `
  w-full px-4 py-3 rounded-xl
  bg-card/50 border text-foreground text-sm font-medium
  placeholder:text-foreground/20
  focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand/40
  transition-all duration-300
  ${hasError
    ? 'border-red-600/50 focus:ring-red-500/20'
    : 'border-border hover:border-brand/30'
  }
`;

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CustomSimulatorPage() {
  const router = useRouter();
  const { addToast } = useUIStore();
  const { mutate: runSimulation, isPending } = useCustomSimulation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(customSimSchema) as any,
    mode: 'onChange',
    defaultValues: {
      asset: '',
      initial_amount: 1000,
      start_date: '2015-01-01',
    },
  });

  const watchedValues = watch();

  const onSubmit = (data: FormData) => {
    runSimulation(
      { sim_type: 'lump_sum', ...data },
      {
        onSuccess: (res) => {
          if (res.success && res.data) {
            router.push(`/result/${res.data.result_id}`);
          } else {
            addToast('Simulation failed — try again.', 'error');
          }
        },
        onError: () => {
          addToast('Something went wrong. Please try again.', 'error');
        },
      }
    );
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12 md:px-8 lg:px-16">
      <div className="max-w-2xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-10">
          <p className="text-brand text-xs font-black uppercase tracking-[0.3em] mb-3">
            Custom Build Protocol
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter mb-4">
            Build Your Own "What If"
          </h1>
          <p className="text-foreground/60 text-base leading-relaxed italic font-light max-w-xl">
            Pick any stock, ETF, or crypto. Set your amount and start date.
            We'll show you what would have happened — in cold, hard dollars.
          </p>
        </div>

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="custom-simulator-form"
          noValidate
          className="flex flex-col gap-6"
        >

          {/* Ticker */}
          <FormField
            label="Asset Ticker"
            id="asset"
            hint="e.g. AAPL, BTC-USD, SPY, TSLA, NVDA"
            error={errors.asset?.message}
          >
            <div className="relative">
              <input
                id="asset"
                type="text"
                autoComplete="off"
                aria-describedby={errors.asset ? 'asset-error' : 'asset-hint'}
                aria-invalid={!!errors.asset}
                placeholder="BTC-USD"
                className={inputClass(!!errors.asset)}
                {...register('asset', {
                  setValueAs: (v: string) => v.toUpperCase().trim(),
                })}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                {watchedValues.asset?.toUpperCase() || ''}
              </span>
            </div>
          </FormField>

          {/* Amount */}
          <FormField
            label="Initial Investment"
            id="initial_amount"
            hint="Between $1 and $10,000,000"
            error={errors.initial_amount?.message}
          >
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
              <input
                id="initial_amount"
                type="number"
                min={1}
                max={10000000}
                step={1}
                aria-describedby={errors.initial_amount ? 'initial_amount-error' : 'initial_amount-hint'}
                aria-invalid={!!errors.initial_amount}
                placeholder="1000"
                className={`${inputClass(!!errors.initial_amount)} pl-8`}
                {...register('initial_amount', { valueAsNumber: true })}
              />
            </div>
          </FormField>

          {/* Start Date */}
          <FormField
            label="Start Date"
            id="start_date"
            hint="Any date from January 2000 to yesterday"
            error={errors.start_date?.message}
          >
            <input
              id="start_date"
              type="date"
              min="2000-01-01"
              max={MAX_DATE.toISOString().split('T')[0]}
              aria-describedby={errors.start_date ? 'start_date-error' : 'start_date-hint'}
              aria-invalid={!!errors.start_date}
              className={`${inputClass(!!errors.start_date)} [color-scheme:dark]`}
              {...register('start_date')}
            />
          </FormField>

          {/* Live preview */}
          {isValid && watchedValues.asset && watchedValues.initial_amount && (
            <div
              aria-live="polite"
              className="rounded-xl border border-brand/25 bg-brand/10 px-5 py-4"
            >
              <p className="text-sm text-brand font-semibold mb-1">✅ Ready to simulate</p>
              <p className="text-xs text-slate-400">
                Investing{' '}
                <strong className="text-slate-200">
                  ${watchedValues.initial_amount?.toLocaleString()}
                </strong>
                {' '}in{' '}
                <strong className="text-slate-200">
                  {watchedValues.asset?.toUpperCase()}
                </strong>
                {' '}starting{' '}
                <strong className="text-slate-200">{watchedValues.start_date}</strong>
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            id="custom-simulator-submit"
            type="submit"
            disabled={isPending || !isValid}
            aria-disabled={isPending || !isValid}
            className={`
              w-full flex items-center justify-center gap-3
              rounded-full py-4 font-bold text-base
              transition-all duration-300
              ${isPending || !isValid
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-brand text-white hover:bg-brand/90 shadow-lg shadow-brand/25 hover:shadow-brand/40'
              }
            `}
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Running simulation...
              </>
            ) : (
              <>
                <TrendingUp size={18} aria-hidden="true" />
                Show Me The Money
              </>
            )}
          </button>

        </form>

        {/* Tips */}
        <div className="mt-12 p-8 rounded-2xl bg-brand/[0.02] border border-border">
          <p className="text-[10px] font-black text-brand uppercase tracking-[0.4em] mb-4">
            Ticker Reference
          </p>
          <ul className="text-xs text-foreground/40 space-y-2.5 font-medium italic">
            {[
              'Stocks: AAPL, MSFT, NVDA, TSLA',
              'Crypto: BTC-USD, ETH-USD, SOL-USD',
              'Index ETFs: SPY, QQQ, VTI, VOO',
              'Use Yahoo Finance format (e.g. BTC-USD not BTCUSD)',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-3">
                <span className="text-brand" aria-hidden="true">›</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </main>
  );
}
