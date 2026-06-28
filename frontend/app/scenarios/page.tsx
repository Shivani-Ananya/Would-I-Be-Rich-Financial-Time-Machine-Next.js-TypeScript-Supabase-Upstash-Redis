'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, TrendingUp, TrendingDown, ArrowRight, Coffee, Bitcoin, Landmark, Building, Coins, PieChart, ShieldCheck, Activity } from 'lucide-react';
import { useCurrency } from '@/lib/CurrencyContext';
import { formatCurrency } from '@/utils/formatCurrency';
import DisclaimerWarning from '@/components/DisclaimerWarning';
import MarketStatusBadge from '@/components/MarketStatusBadge';

// ─── Chat Exchanges ───────────────────────────────────────────────────
const EXCHANGES = [
  {
    side: 'left' as const,
    sender: 'SpendBot',
    text: "Guys, I just spent \u20b98,500 on dinner at a 5-star restaurant and upgraded all my OTT subscriptions to Ultra HD. Why save for a distant future when the present is delicious?",
  },
  {
    side: 'right' as const,
    sender: 'InvestBot',
    text: "That \u20b98,500 monthly leak compounded at 12% in Nifty 50 over 10 years becomes \u20b919,10,000. You are literally chewing on a down payment for a flat.",
  },
  {
    side: 'left' as const,
    sender: 'SpendBot',
    text: "A flat? I live in a rented apartment and I like it! What if I shut down permanently tomorrow? Live in the now! You sit on dry numbers while I enjoy premium coffee and Zomato Gold.",
  },
  {
    side: 'right' as const,
    sender: 'InvestBot',
    text: "Compounding is not about deprivation. If you direct just 30% of your cafe and shopping spends into equity or gold, you buy future freedom. You won\u2019t have to work for rent at age 60.",
  },
  {
    side: 'left' as const,
    sender: 'SpendBot',
    text: "But look, Myntra Big Billion Days are live! 50% off on premium sneakers! Mathematically, buying now is a 50% yield, right?",
  },
  {
    side: 'right' as const,
    sender: 'InvestBot',
    text: "A 50% discount on depreciating goods is still a 100% loss of capital. The sneakers hit zero value. Stocks of the shoe manufacturer would double your capital instead. Invest in the things you consume, don\u2019t just consume them.",
  },
  {
    side: 'left' as const,
    sender: 'SpendBot',
    text: "Wait... I ran a quick simulation. If I redirected my Zomato and Myntra spending into Nifty 50 for 15 years... Total Missed Wealth: \u20b934,22,400. Can I really still buy sneakers from dividend yield?",
  },
  {
    side: 'right' as const,
    sender: 'InvestBot',
    text: "Exactly. Invest first, then buy what you love from your asset yields, not your primary salary. Scroll down to see how your spending stacks up against investments over time \u2193",
  },
];

// ─── Investment Options ────────────────────────────────────────────────
interface InvestmentOption {
  id: string;
  name: string;
  annualReturnPct: number;
  icon: React.ReactNode;
  color: string;
  riskLabel: string;
}

const INVESTMENT_OPTIONS: InvestmentOption[] = [
  { id: 'nifty', name: 'Nifty 50 Index', annualReturnPct: 12, icon: <TrendingUp size={18} />, color: '#EC4899', riskLabel: 'Medium' },
  { id: 'btc', name: 'Bitcoin', annualReturnPct: 45, icon: <Bitcoin size={18} />, color: '#F59E0B', riskLabel: 'High' },
  { id: 'gold', name: 'Physical Gold', annualReturnPct: 8, icon: <Coins size={18} />, color: '#FCD34D', riskLabel: 'Low' },
  { id: 'ppf', name: 'PPF / Govt Bonds', annualReturnPct: 7.1, icon: <Landmark size={18} />, color: '#A855F7', riskLabel: 'Low' },
  { id: 'fd', name: 'Fixed Deposit', annualReturnPct: 6.5, icon: <ShieldCheck size={18} />, color: '#14B8A6', riskLabel: 'Low' },
  { id: 'reit', name: 'Real Estate (REITs)', annualReturnPct: 9, icon: <Building size={18} />, color: '#06B6D4', riskLabel: 'Medium' },
  { id: 'spy', name: 'S&P 500 (SPY)', annualReturnPct: 10, icon: <PieChart size={18} />, color: '#3B82F6', riskLabel: 'Medium' },
  { id: 'nvda', name: 'NVIDIA Stock', annualReturnPct: 35, icon: <Activity size={18} />, color: '#10B981', riskLabel: 'High' },
];

// ─── Math Helpers ──────────────────────────────────────────────────────
function futureValue(monthly: number, annualPct: number, years: number) {
  if (monthly <= 0) return 0;
  const r = annualPct / 100 / 12;
  if (r === 0) return monthly * 12 * years;
  return monthly * ((Math.pow(1 + r, 12 * years) - 1) / r);
}

function yearlySnapshots(monthly: number, annualPct: number, years: number) {
  const snapshots: number[] = [];
  for (let y = 1; y <= years; y++) {
    snapshots.push(futureValue(monthly, annualPct, y));
  }
  return snapshots;
}

// ─── Scenario Page ─────────────────────────────────────────────────────
export default function ScenariosPage() {
  const { currency, exchangeRate } = useCurrency();
  const fmt = (v: number) => formatCurrency(v, false, currency);

  // Chat state
  const [visibleCount, setVisibleCount] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatDone, setChatDone] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Custom calculator state
  const [customMonthly, setCustomMonthly] = useState('5000');
  const [customYears, setCustomYears] = useState(10);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState('nifty');



  const selectedInvestment = INVESTMENT_OPTIONS.find(i => i.id === selectedInvestmentId)!;

  // Typewriter effect
  useEffect(() => {
    if (chatDone) return;
    if (visibleCount >= EXCHANGES.length) {
      setChatDone(true);
      return;
    }

    const msg = EXCHANGES[visibleCount];
    let charIdx = 0;
    setTypedText('');
    setIsTyping(true);

    const interval = setInterval(() => {
      if (charIdx < msg.text.length) {
        setTypedText(prev => prev + msg.text[charIdx]);
        charIdx++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setTimeout(() => {
          setVisibleCount(prev => prev + 1);
          setTypedText('');
        }, 800);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [visibleCount, chatDone]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleCount, typedText]);

  const handleSkip = () => {
    setVisibleCount(EXCHANGES.length);
    setTypedText('');
    setIsTyping(false);
    setChatDone(true);
  };

  const handleReplay = () => {
    setVisibleCount(0);
    setTypedText('');
    setChatDone(false);
  };

  // ─── Comparison Chart Data ─────────────────────────────────────────
  const COMPARISON_YEARS = 15;
  const COFFEE_MONTHLY = 3000; // "Current You" spends on coffee/food
  const spendingSnapshots = Array.from({ length: COMPARISON_YEARS }, (_, i) => COFFEE_MONTHLY * 12 * (i + 1));
  const investingSnapshots = yearlySnapshots(COFFEE_MONTHLY, 12, COMPARISON_YEARS); // Nifty 12%

  const maxVal = Math.max(...investingSnapshots, ...spendingSnapshots);

  // ─── Custom Calculator ─────────────────────────────────────────────
  const customMonthlyNum = parseFloat(customMonthly) || 0;
  const customFV = useMemo(
    () => futureValue(customMonthlyNum, selectedInvestment.annualReturnPct, customYears),
    [customMonthlyNum, selectedInvestment, customYears]
  );
  const customTotalInvested = customMonthlyNum * 12 * customYears;
  const customGain = customFV - customTotalInvested;

  // Custom chart snapshots
  const customSpendSnapshots = Array.from({ length: customYears }, (_, i) => customMonthlyNum * 12 * (i + 1));
  const customInvestSnapshots = useMemo(
    () => yearlySnapshots(customMonthlyNum, selectedInvestment.annualReturnPct, customYears),
    [customMonthlyNum, selectedInvestment, customYears]
  );
  const customMaxVal = Math.max(...customInvestSnapshots, ...customSpendSnapshots, 1);

  return (
    <main className="min-h-screen bg-[#070B1A] relative overflow-hidden font-sans pb-32">
      <div className="bg-mesh" />

      {/* NAVBAR */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <img src="/icon.png" alt="WouldIBeRich Logo" className="w-8 h-8 object-contain rounded-lg" />
          <span className="font-bold text-xl tracking-tight text-white hidden sm:block">WouldIBeRich</span>
        </Link>
        <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-8 text-sm font-medium text-gray-300 pointer-events-auto">
            <Link href="/scenarios" className="hover:text-white transition-colors text-white font-semibold">Scenarios</Link>
            <Link href="/spending-personality" className="hover:text-white transition-colors font-bold text-[#EC4899]">Spending Personality</Link>
            <Link href="/compare" className="hover:text-white transition-colors font-bold text-[#00F5A0]">The Lost Opportunity</Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
          </div>
        </div>
        <div className="flex items-center gap-4 z-10 relative">
          <MarketStatusBadge />
          <Link href="/"><button className="glass-panel px-4 py-1.5 rounded-full text-xs font-bold text-white hover:bg-white/10 transition-colors">Home</button></Link>
        </div>
      </nav>

      <div className="relative z-10 px-4 md:px-6 pt-10 max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-4">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">AI Financial Debate</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            Spending vs <span className="text-gradient">Investing</span>
          </h1>
          <p className="text-gray-400 text-base max-w-lg mx-auto leading-relaxed">
            Two AI bots debate whether your daily spending could make you rich. Watch the conversation unfold.
          </p>
        </div>

        {/* ─── CHAT BUBBLES ───────────────────────────────────────── */}
        <div className="relative mb-6">
          {/* Robot Avatar - floating center top */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20 border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)]"
            >
              <Bot size={32} className="text-[#8B5CF6]" />
            </motion.div>
          </div>

          {/* Chat container */}
          <div className="max-h-[480px] overflow-y-auto pr-2 chat-scrollbar space-y-4 pb-4">
            {/* Rendered completed messages */}
            {EXCHANGES.slice(0, visibleCount).map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.side === 'right' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] ${msg.side === 'right' ? 'flex-row-reverse' : ''}`}>
                  {/* Mini avatar */}
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black border ${
                    msg.side === 'left'
                      ? 'bg-[#EC4899]/10 border-[#EC4899]/30 text-[#EC4899]'
                      : 'bg-[#00F5A0]/10 border-[#00F5A0]/30 text-[#00F5A0]'
                  }`}>
                    {msg.side === 'left' ? <Coffee size={13} /> : <TrendingUp size={13} />}
                  </div>
                  {/* Bubble */}
                  <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed relative ${
                    msg.side === 'left'
                      ? 'bg-[#EC4899]/10 border border-[#EC4899]/20 text-gray-200 rounded-bl-md'
                      : 'bg-[#00F5A0]/10 border border-[#00F5A0]/20 text-gray-200 rounded-br-md'
                  }`}>
                    <div className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${
                      msg.side === 'left' ? 'text-[#EC4899]' : 'text-[#00F5A0]'
                    }`}>{msg.sender}</div>
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Currently typing message */}
            {visibleCount < EXCHANGES.length && !chatDone && (
              <div className={`flex ${EXCHANGES[visibleCount].side === 'right' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-end gap-2 max-w-[85%] ${EXCHANGES[visibleCount].side === 'right' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black border ${
                    EXCHANGES[visibleCount].side === 'left'
                      ? 'bg-[#EC4899]/10 border-[#EC4899]/30 text-[#EC4899]'
                      : 'bg-[#00F5A0]/10 border-[#00F5A0]/30 text-[#00F5A0]'
                  }`}>
                    {EXCHANGES[visibleCount].side === 'left' ? <Coffee size={13} /> : <TrendingUp size={13} />}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed relative ${
                    EXCHANGES[visibleCount].side === 'left'
                      ? 'bg-[#EC4899]/10 border border-[#EC4899]/20 text-gray-200 rounded-bl-md'
                      : 'bg-[#00F5A0]/10 border border-[#00F5A0]/20 text-gray-200 rounded-br-md'
                  }`}>
                    <div className={`text-[9px] font-bold uppercase tracking-widest mb-1 ${
                      EXCHANGES[visibleCount].side === 'left' ? 'text-[#EC4899]' : 'text-[#00F5A0]'
                    }`}>{EXCHANGES[visibleCount].sender}</div>
                    {typedText}
                    {isTyping && <span className={`inline-block w-1.5 h-3.5 ml-0.5 animate-pulse rounded-sm ${
                      EXCHANGES[visibleCount].side === 'left' ? 'bg-[#EC4899]' : 'bg-[#00F5A0]'
                    }`} />}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-center gap-3 mb-16">
          {!chatDone ? (
            <button onClick={handleSkip} className="glass-panel px-5 py-2 rounded-full text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
              Skip Conversation
            </button>
          ) : (
            <button onClick={handleReplay} className="glass-panel px-5 py-2 rounded-full text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
              Replay Conversation
            </button>
          )}
        </div>

        {/* ─── COMPARISON TIMELINE ────────────────────────────────── */}
        <AnimatePresence>
          {chatDone && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Section: Current You vs Alternate You */}
              <div className="mb-20">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                    Current You vs <span className="text-gradient">Alternate You</span>
                  </h2>
                  <p className="text-gray-400 text-xs max-w-md mx-auto">
                    What if you invested {fmt(COFFEE_MONTHLY)}/mo in Nifty 50 instead of spending it on coffee and food delivery?
                  </p>
                </div>

                {/* Visual Bar Chart */}
                <div className="glass-panel p-6 rounded-2xl border border-white/5 mb-4">
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-sm bg-[#EC4899]" />
                      <span className="text-gray-300">Current You <span className="text-gray-500">(Spent on coffee)</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-sm bg-[#00F5A0]" />
                      <span className="text-gray-300">Alternate You <span className="text-gray-500">(Invested in Nifty 50)</span></span>
                    </div>
                  </div>

                  {/* Bars */}
                  <div className="flex items-end gap-1.5 h-48 relative">
                    {spendingSnapshots.map((spent, i) => {
                      const invested = investingSnapshots[i];
                      const spentH = (spent / maxVal) * 100;
                      const investedH = (invested / maxVal) * 100;
                      return (
                        <div key={i} className="flex-1 flex items-end gap-px h-full group relative">
                          {/* Spending bar */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${spentH}%` }}
                            transition={{ duration: 0.6, delay: i * 0.05 }}
                            className="flex-1 bg-gradient-to-t from-[#EC4899] to-[#EC4899]/40 rounded-t-sm min-h-[2px] relative"
                          />
                          {/* Investing bar */}
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${investedH}%` }}
                            transition={{ duration: 0.6, delay: i * 0.05 + 0.1 }}
                            className="flex-1 bg-gradient-to-t from-[#00F5A0] to-[#00F5A0]/40 rounded-t-sm min-h-[2px] shadow-[0_0_6px_rgba(0,245,160,0.3)]"
                          />
                          {/* Year label */}
                          {(i === 0 || i === 4 || i === 9 || i === 14) && (
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-gray-500 font-bold">
                              Yr {i + 1}
                            </div>
                          )}
                          {/* Tooltip on hover */}
                          <div className="absolute -top-20 left-1/2 -translate-x-1/2 glass-panel px-3 py-2 rounded-lg text-[9px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 border border-white/10">
                            <div className="text-[#EC4899] font-bold">Spent: {fmt(spent)}</div>
                            <div className="text-[#00F5A0] font-bold">Invested: {fmt(invested)}</div>
                            <div className="text-gray-400">Year {i + 1}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* X-axis label */}
                  <div className="text-center mt-8 text-[9px] text-gray-500 font-bold uppercase tracking-widest">Years of Compounding</div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-5 rounded-2xl border border-[#EC4899]/20 text-center">
                    <div className="text-[9px] font-bold text-[#EC4899] uppercase tracking-widest mb-1">Current You</div>
                    <div className="text-xs text-gray-400 mb-2">Total spent on food &amp; coffee</div>
                    <div className="text-xl font-black text-[#EC4899]">{fmt(spendingSnapshots[COMPARISON_YEARS - 1])}</div>
                    <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-red-400 font-bold"><TrendingDown size={12} /> Value left: {fmt(0)}</div>
                  </div>
                  <div className="glass-panel p-5 rounded-2xl border border-[#00F5A0]/20 text-center">
                    <div className="text-[9px] font-bold text-[#00F5A0] uppercase tracking-widest mb-1">Alternate You</div>
                    <div className="text-xs text-gray-400 mb-2">Invested in Nifty 50 @ 12%</div>
                    <div className="text-xl font-black text-[#00F5A0]">{fmt(investingSnapshots[COMPARISON_YEARS - 1])}</div>
                    <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-[#00F5A0] font-bold"><TrendingUp size={12} /> Wealth gained</div>
                  </div>
                </div>
              </div>

              {/* ─── CUSTOM YOUR OWN ───────────────────────────────── */}
              <div className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">
                    Customize <span className="text-gradient">Your Own</span>
                  </h2>
                  <p className="text-gray-400 text-xs max-w-md mx-auto">
                    Enter your monthly spending amount, pick an investment, choose your horizon, and see the magic of compounding.
                  </p>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 mb-6">
                  {/* Inputs Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Monthly Amount */}
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Monthly Amount</label>
                      <div className="flex items-center bg-white/5 rounded-lg border border-white/10 px-3 py-2">
                        <span className="text-gray-400 text-xs mr-1.5">{currency === 'USD' ? '$' : '\u20b9'}</span>
                        <input
                          type="text"
                          value={customMonthly}
                          onChange={e => { if (/^\d*\.?\d*$/.test(e.target.value)) setCustomMonthly(e.target.value); }}
                          className="bg-transparent border-none text-white text-sm font-bold w-full outline-none"
                          placeholder="5000"
                        />
                      </div>
                    </div>
                    {/* Years */}
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Investment Horizon</label>
                      <div className="flex items-center gap-2">
                        {[5, 10, 15, 20, 25].map(y => (
                          <button
                            key={y}
                            onClick={() => setCustomYears(y)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                              customYears === y
                                ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-lg shadow-[#8B5CF6]/20'
                                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
                            }`}
                          >
                            {y}y
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Selected investment display */}
                    <div>
                      <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1.5">Selected Investment</label>
                      <div className="flex items-center gap-2 bg-white/5 rounded-lg border border-white/10 px-3 py-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ color: selectedInvestment.color, background: `${selectedInvestment.color}15` }}>
                          {selectedInvestment.icon}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{selectedInvestment.name}</div>
                          <div className="text-[9px] text-gray-400">{selectedInvestment.annualReturnPct}% / yr &middot; {selectedInvestment.riskLabel} Risk</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Investment Options Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                    {INVESTMENT_OPTIONS.map(inv => (
                      <button
                        key={inv.id}
                        onClick={() => setSelectedInvestmentId(inv.id)}
                        className={`p-3 rounded-xl text-left transition-all group ${
                          selectedInvestmentId === inv.id
                            ? 'bg-white/10 border-2 shadow-lg'
                            : 'bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10'
                        }`}
                        style={selectedInvestmentId === inv.id ? { borderColor: inv.color, boxShadow: `0 0 15px ${inv.color}20` } : {}}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ color: inv.color, background: `${inv.color}15` }}>
                            {inv.icon}
                          </div>
                          <span className="text-[10px] font-bold text-white truncate">{inv.name}</span>
                        </div>
                        <div className="text-[9px] text-gray-400">{inv.annualReturnPct}% &middot; {inv.riskLabel}</div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Chart */}
                  {customMonthlyNum > 0 && (
                    <>
                      <div className="flex items-center justify-center gap-6 mb-4">
                        <div className="flex items-center gap-2 text-[10px]">
                          <div className="w-2.5 h-2.5 rounded-sm bg-[#EC4899]" />
                          <span className="text-gray-300">Just Spending</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px]">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: selectedInvestment.color }} />
                          <span className="text-gray-300">Invested in {selectedInvestment.name}</span>
                        </div>
                      </div>
                      <div className="flex items-end gap-1 h-40 mb-2">
                        {customSpendSnapshots.map((spent, i) => {
                          const invested = customInvestSnapshots[i];
                          const spentH = (spent / customMaxVal) * 100;
                          const investedH = (invested / customMaxVal) * 100;
                          return (
                            <div key={i} className="flex-1 flex items-end gap-px h-full group relative">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${spentH}%` }}
                                transition={{ duration: 0.5, delay: i * 0.03 }}
                                className="flex-1 bg-gradient-to-t from-[#EC4899] to-[#EC4899]/30 rounded-t-sm min-h-[2px]"
                              />
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${investedH}%` }}
                                transition={{ duration: 0.5, delay: i * 0.03 + 0.05 }}
                                className="flex-1 rounded-t-sm min-h-[2px]"
                                style={{ background: `linear-gradient(to top, ${selectedInvestment.color}, ${selectedInvestment.color}40)`, boxShadow: `0 0 6px ${selectedInvestment.color}40` }}
                              />
                              {(i === 0 || i === Math.floor(customYears / 2) - 1 || i === customYears - 1) && (
                                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[7px] text-gray-500 font-bold">
                                  {i + 1}y
                                </div>
                              )}
                              <div className="absolute -top-16 left-1/2 -translate-x-1/2 glass-panel px-2.5 py-1.5 rounded-lg text-[8px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30 border border-white/10">
                                <div className="text-[#EC4899] font-bold">Spent: {fmt(spent)}</div>
                                <div className="font-bold" style={{ color: selectedInvestment.color }}>Invested: {fmt(invested)}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Result Cards */}
                {customMonthlyNum > 0 && (
                  <div className="glass-panel p-6 rounded-[30px] border border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.1)]">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6]/5 to-transparent" />
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Invested</div>
                        <div className="text-lg font-black text-white">{fmt(customTotalInvested)}</div>
                        <div className="text-[10px] text-gray-400">{fmt(customMonthlyNum)}/mo &times; {customYears} yrs</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: selectedInvestment.color }}>Future Value</div>
                        <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F5A0] via-[#3B82F6] to-[#8B5CF6]" style={{ filter: 'drop-shadow(0 0 15px rgba(0, 245, 160, 0.3))' }}>
                          {fmt(customFV)}
                        </div>
                        <div className="text-[10px] text-gray-400">in {selectedInvestment.name} @ {selectedInvestment.annualReturnPct}%</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-[#00F5A0] uppercase tracking-widest mb-1">Wealth Gained</div>
                        <div className="text-lg font-black text-[#00F5A0]">{fmt(customGain)}</div>
                        <div className="text-[10px] text-gray-400 inline-flex items-center gap-1"><TrendingUp size={10} /> +{customTotalInvested > 0 ? ((customGain / customTotalInvested) * 100).toFixed(0) : 0}% returns</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <DisclaimerWarning />

      {/* Custom scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}} />
    </main>
  );
}
