'use client';

import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

const FUN_FACTS = [
  '💡 $1 invested in Apple in 2000 is worth ~$780 today.',
  '📈 The S&P 500 has returned ~10% per year on average since 1957.',
  '₿ Bitcoin went from $0.003 to over $60,000 — a 2,000,000,000% rise.',
  '🏡 Austin, TX home prices rose 80% between 2015 and 2022.',
  '☕ The average American spends $1,100/year on coffee.',
  '🚀 $1,000 in Tesla (2010) would be worth ~$200,000 by 2021.',
  '📉 FOMO is the #1 driver of retail investment decisions, per surveys.',
  '🪙 Ethereum launched at $0.31 in 2015. It hit $4,800 in 2021.',
  '🏦 Compound interest doubles your money roughly every 7 years at 10%.',
  '🎮 Nintendo stock rose 80% in 6 months after Pokémon GO launched.',
];

const PROGRESS_MESSAGES = [
  'Firing up the time machine...',
  'Fetching historical prices...',
  'Running the simulation...',
  'Crunching the numbers...',
  'Almost there...',
];

interface SimulatingOverlayProps {
  isOpen: boolean;
}

export default function SimulatingOverlay({ isOpen }: SimulatingOverlayProps) {
  const [factIndex, setFactIndex] = useState(0);
  const [progressIndex, setProgressIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setProgressIndex(0);
      setFactIndex(Math.floor(Math.random() * FUN_FACTS.length));
      return;
    }

    // Cycle fun facts every 2.2s
    const factTimer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setFactIndex((i) => (i + 1) % FUN_FACTS.length);
        setFadeIn(true);
      }, 300);
    }, 2200);

    // Progress bar simulation — fills to 90% over ~4s, holds until done
    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        // Ease-out: faster at start, slower near 90%
        const increment = Math.max(1, (90 - p) / 10);
        return Math.min(90, p + increment);
      });
    }, 150);

    // Step through progress messages
    const msgTimer = setInterval(() => {
      setProgressIndex((i) => Math.min(i + 1, PROGRESS_MESSAGES.length - 1));
    }, 900);

    return () => {
      clearInterval(factTimer);
      clearInterval(progressTimer);
      clearInterval(msgTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Running simulation"
      aria-live="polite"
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center animate-ink-bleed
                 bg-background/98 backdrop-blur-xl px-6 text-center"
    >
      {/* Precision animated rings */}
      <div className="relative mb-12" aria-hidden="true">
        <div className="w-24 h-24 rounded-full border border-brand/10 absolute inset-0 animate-ping" />
        <div className="w-24 h-24 rounded-full border-2 border-brand/20 absolute inset-0 animate-pulse duration-[2000ms]" />
        <div className="w-24 h-24 rounded-full bg-brand/5 border border-brand/40 flex items-center justify-center shadow-2xl shadow-brand/10">
          <TrendingUp size={36} className="text-brand animate-bounce duration-[3000ms]" />
        </div>
      </div>

      {/* Progress message (Bold Label) */}
      <p className="text-foreground font-black text-xl uppercase tracking-tighter mb-2">
        {PROGRESS_MESSAGES[progressIndex]}
      </p>

      {/* Industrial Progress bar */}
      <div
        className="w-full max-w-xs h-1 bg-foreground/10 rounded-full overflow-hidden mb-12 shadow-inner"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-brand rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(198,255,0,0.4)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Fact card (The Ledger Style) */}
      <div
        className={`
          max-w-sm rounded-[2rem] border border-border bg-card/80 px-8 py-6
          transition-all duration-500 shadow-2xl shadow-black/50
          ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
      >
        <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.3em] mb-4">
          Archive Fragment 00{factIndex + 1}
        </p>
        <p className="text-base text-foreground font-light italic leading-snug">
          {FUN_FACTS[factIndex]}
        </p>
      </div>

      {/* Discrete Brand hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-foreground/10 uppercase tracking-[0.5em]">
        WIBR Simulation Engine 1.0.4
      </div>
    </div>
  );
}
