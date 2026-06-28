'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, TrendingUp, Bitcoin, Activity, 
  Building, Landmark, ShieldCheck, PieChart, 
  Coins, ArrowRight, Settings, X
} from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/lib/CurrencyContext';
import { formatCurrency } from '@/utils/formatCurrency';
import DisclaimerWarning from '@/components/DisclaimerWarning';
import MarketStatusBadge from '@/components/MarketStatusBadge';

// --- Types ---
type Frequency = 'daily' | 'weekly' | 'monthly';

interface Expense {
  id: string;
  name: string;
  amount: string;
  frequency: Frequency;
}

type RiskLevel = 'Low' | 'Medium' | 'High';
type InvestmentCategory = 'All' | 'Crypto' | 'Stocks' | 'Index Funds' | 'Gold & Silver' | 'Real Estate' | 'Government Schemes' | 'Fixed Income';

interface InvestmentBase {
  id: string;
  name: string;
  category: InvestmentCategory;
  riskLevel: RiskLevel;
  icon: React.ReactNode;
  color: string;
}

interface Investment extends InvestmentBase {
  annualReturnPct: number;
}

// --- Data ---
const DEFAULT_ASSET_RETURNS: Record<string, number> = {
  // Crypto
  'Bitcoin': 50, 'Ethereum': 45, 'Solana': 60, 'Cardano': 40, 'Binance Coin': 45,
  // Stocks
  'NVIDIA Stock': 35, 'Apple Stock': 20, 'Microsoft': 22, 'Tesla': 45, 'Amazon': 20,
  'Alphabet (Google)': 18, 'Meta': 24, 'Netflix': 28, 'Reliance': 14, 'TCS': 15,
  'HDFC Bank': 14, 'Infosys': 14, 'SBI': 12, 'ITC': 10, 'Bajaj Finance': 25,
  // Index Funds
  'S&P 500 (SPY)': 10, 'Nifty 50': 12, 'Mid-Cap Index': 15, 'Small-Cap Index': 18, 'Nasdaq 100 ETF': 16,
  // Gold & Silver
  'Physical Gold': 8, 'Physical Silver': 9, 'Digital Gold': 8.2, 'Gold ETFs': 8.5, 'Silver ETFs': 9.5,
  // Real Estate
  'Real Estate (Tier 1)': 14, 'REITs': 9, 'Commercial Real Estate': 12, 'Agricultural Land': 15, 'Tier 2 City Plots': 18,
  // Government Schemes
  'Sovereign Gold Bonds (SGB)': 8.5, 'Public Provident Fund (PPF)': 7.1, 'National Savings Certificate (NSC)': 7.7, 'Sukanya Samriddhi Yojana (SSY)': 8.2, 'Kisan Vikas Patra (KVP)': 7.5,
  // Fixed Income
  'Fixed Deposit (FD)': 6.5, 'Corporate Bonds': 9, 'Recurring Deposit (RD)': 6.5, 'Debt Mutual Funds': 7.5, 'Post Office MIS': 7.4,
};

const BASE_INVESTMENTS: InvestmentBase[] = [
  // Crypto
  { id: 'btc', name: 'Bitcoin', category: 'Crypto', riskLevel: 'High', icon: <Bitcoin size={18} />, color: 'from-[#F59E0B]/20 to-transparent' },
  { id: 'eth', name: 'Ethereum', category: 'Crypto', riskLevel: 'High', icon: <Coins size={18} />, color: 'from-[#8B5CF6]/20 to-transparent' },
  { id: 'sol', name: 'Solana', category: 'Crypto', riskLevel: 'High', icon: <Coins size={18} />, color: 'from-[#14B8A6]/20 to-transparent' },
  { id: 'ada', name: 'Cardano', category: 'Crypto', riskLevel: 'High', icon: <Coins size={18} />, color: 'from-[#3B82F6]/20 to-transparent' },
  { id: 'bnb', name: 'Binance Coin', category: 'Crypto', riskLevel: 'High', icon: <Coins size={18} />, color: 'from-[#FBBF24]/20 to-transparent' },
  
  // Stocks
  { id: 'nvda', name: 'NVIDIA Stock', category: 'Stocks', riskLevel: 'High', icon: <Activity size={18} />, color: 'from-[#10B981]/20 to-transparent' },
  { id: 'aapl', name: 'Apple Stock', category: 'Stocks', riskLevel: 'Medium', icon: <Activity size={18} />, color: 'from-[#6B7280]/20 to-transparent' },
  { id: 'msft', name: 'Microsoft', category: 'Stocks', riskLevel: 'Medium', icon: <Activity size={18} />, color: 'from-[#0EA5E9]/20 to-transparent' },
  { id: 'tsla', name: 'Tesla', category: 'Stocks', riskLevel: 'High', icon: <Activity size={18} />, color: 'from-[#EF4444]/20 to-transparent' },
  { id: 'amzn', name: 'Amazon', category: 'Stocks', riskLevel: 'Medium', icon: <Activity size={18} />, color: 'from-[#F59E0B]/20 to-transparent' },
  { id: 'goog', name: 'Alphabet (Google)', category: 'Stocks', riskLevel: 'Medium', icon: <Activity size={18} />, color: 'from-[#10B981]/20 to-transparent' },
  { id: 'meta', name: 'Meta', category: 'Stocks', riskLevel: 'High', icon: <Activity size={18} />, color: 'from-[#3B82F6]/20 to-transparent' },
  { id: 'nflx', name: 'Netflix', category: 'Stocks', riskLevel: 'High', icon: <Activity size={18} />, color: 'from-[#EC4899]/20 to-transparent' },
  { id: 'rel', name: 'Reliance', category: 'Stocks', riskLevel: 'Medium', icon: <Activity size={18} />, color: 'from-[#3B82F6]/20 to-transparent' },
  { id: 'tcs', name: 'TCS', category: 'Stocks', riskLevel: 'Medium', icon: <Activity size={18} />, color: 'from-[#8B5CF6]/20 to-transparent' },
  { id: 'hdfc', name: 'HDFC Bank', category: 'Stocks', riskLevel: 'Medium', icon: <Activity size={18} />, color: 'from-[#14B8A6]/20 to-transparent' },
  { id: 'infy', name: 'Infosys', category: 'Stocks', riskLevel: 'Medium', icon: <Activity size={18} />, color: 'from-[#06B6D4]/20 to-transparent' },
  { id: 'sbi', name: 'SBI', category: 'Stocks', riskLevel: 'Medium', icon: <Activity size={18} />, color: 'from-[#3B82F6]/20 to-transparent' },
  { id: 'itc', name: 'ITC', category: 'Stocks', riskLevel: 'Medium', icon: <Activity size={18} />, color: 'from-[#FCD34D]/20 to-transparent' },
  { id: 'bajaj', name: 'Bajaj Finance', category: 'Stocks', riskLevel: 'High', icon: <Activity size={18} />, color: 'from-[#F43F5E]/20 to-transparent' },
  
  // Index Funds
  { id: 'spy', name: 'S&P 500 (SPY)', category: 'Index Funds', riskLevel: 'Medium', icon: <PieChart size={18} />, color: 'from-[#3B82F6]/20 to-transparent' },
  { id: 'nifty', name: 'Nifty 50', category: 'Index Funds', riskLevel: 'Medium', icon: <TrendingUp size={18} />, color: 'from-[#EC4899]/20 to-transparent' },
  { id: 'midcap', name: 'Mid-Cap Index', category: 'Index Funds', riskLevel: 'High', icon: <TrendingUp size={18} />, color: 'from-[#F43F5E]/20 to-transparent' },
  { id: 'smallcap', name: 'Small-Cap Index', category: 'Index Funds', riskLevel: 'High', icon: <TrendingUp size={18} />, color: 'from-[#EF4444]/20 to-transparent' },
  { id: 'nasdaq', name: 'Nasdaq 100 ETF', category: 'Index Funds', riskLevel: 'Medium', icon: <TrendingUp size={18} />, color: 'from-[#0EA5E9]/20 to-transparent' },
  
  // Gold & Silver
  { id: 'gold', name: 'Physical Gold', category: 'Gold & Silver', riskLevel: 'Low', icon: <Coins size={18} />, color: 'from-[#FCD34D]/20 to-transparent' },
  { id: 'silver', name: 'Physical Silver', category: 'Gold & Silver', riskLevel: 'Medium', icon: <Coins size={18} />, color: 'from-[#9CA3AF]/20 to-transparent' },
  { id: 'digitalgold', name: 'Digital Gold', category: 'Gold & Silver', riskLevel: 'Low', icon: <Coins size={18} />, color: 'from-[#F59E0B]/20 to-transparent' },
  { id: 'goldetf', name: 'Gold ETFs', category: 'Gold & Silver', riskLevel: 'Low', icon: <PieChart size={18} />, color: 'from-[#FBBF24]/20 to-transparent' },
  { id: 'silveretf', name: 'Silver ETFs', category: 'Gold & Silver', riskLevel: 'Medium', icon: <PieChart size={18} />, color: 'from-[#D1D5DB]/20 to-transparent' },
  
  // Real Estate
  { id: 'reit', name: 'Real Estate (Tier 1)', category: 'Real Estate', riskLevel: 'Medium', icon: <Building size={18} />, color: 'from-[#06B6D4]/20 to-transparent' },
  { id: 'reits', name: 'REITs', category: 'Real Estate', riskLevel: 'Medium', icon: <Building size={18} />, color: 'from-[#3B82F6]/20 to-transparent' },
  { id: 'cre', name: 'Commercial Real Estate', category: 'Real Estate', riskLevel: 'Medium', icon: <Building size={18} />, color: 'from-[#8B5CF6]/20 to-transparent' },
  { id: 'agri', name: 'Agricultural Land', category: 'Real Estate', riskLevel: 'Medium', icon: <Building size={18} />, color: 'from-[#22C55E]/20 to-transparent' },
  { id: 'tier2', name: 'Tier 2 City Plots', category: 'Real Estate', riskLevel: 'High', icon: <Building size={18} />, color: 'from-[#F59E0B]/20 to-transparent' },
  
  // Government Schemes
  { id: 'sgb', name: 'Sovereign Gold Bonds (SGB)', category: 'Government Schemes', riskLevel: 'Low', icon: <Landmark size={18} />, color: 'from-[#FBBF24]/20 to-transparent' },
  { id: 'ppf', name: 'Public Provident Fund (PPF)', category: 'Government Schemes', riskLevel: 'Low', icon: <Landmark size={18} />, color: 'from-[#A855F7]/20 to-transparent' },
  { id: 'nsc', name: 'National Savings Certificate (NSC)', category: 'Government Schemes', riskLevel: 'Low', icon: <Landmark size={18} />, color: 'from-[#3B82F6]/20 to-transparent' },
  { id: 'ssy', name: 'Sukanya Samriddhi Yojana (SSY)', category: 'Government Schemes', riskLevel: 'Low', icon: <Landmark size={18} />, color: 'from-[#EC4899]/20 to-transparent' },
  { id: 'kvp', name: 'Kisan Vikas Patra (KVP)', category: 'Government Schemes', riskLevel: 'Low', icon: <Landmark size={18} />, color: 'from-[#10B981]/20 to-transparent' },
  
  // Fixed Income
  { id: 'fd', name: 'Fixed Deposit (FD)', category: 'Fixed Income', riskLevel: 'Low', icon: <ShieldCheck size={18} />, color: 'from-[#14B8A6]/20 to-transparent' },
  { id: 'bonds', name: 'Corporate Bonds', category: 'Fixed Income', riskLevel: 'Medium', icon: <ShieldCheck size={18} />, color: 'from-[#6366F1]/20 to-transparent' },
  { id: 'rd', name: 'Recurring Deposit (RD)', category: 'Fixed Income', riskLevel: 'Low', icon: <ShieldCheck size={18} />, color: 'from-[#0EA5E9]/20 to-transparent' },
  { id: 'debtmf', name: 'Debt Mutual Funds', category: 'Fixed Income', riskLevel: 'Low', icon: <PieChart size={18} />, color: 'from-[#8B5CF6]/20 to-transparent' },
  { id: 'mis', name: 'Post Office MIS', category: 'Fixed Income', riskLevel: 'Low', icon: <ShieldCheck size={18} />, color: 'from-[#F43F5E]/20 to-transparent' },
];

const CATEGORIES: InvestmentCategory[] = [
  'All', 'Crypto', 'Stocks', 'Index Funds', 'Gold & Silver', 'Real Estate', 'Government Schemes', 'Fixed Income'
];

const INVESTMENT_YEARS = 10;

// --- Helper Math ---
function calculateFutureValue(monthlyContribution: number, annualRatePct: number, years: number) {
  if (monthlyContribution <= 0) return 0;
  const r = annualRatePct / 100;
  const n = 12;
  const t = years;
  
  if (r === 0) return monthlyContribution * 12 * years;

  // FV = P * [ ((1 + r/n)^(nt) - 1) / (r/n) ]
  const fv = monthlyContribution * ((Math.pow(1 + r/n, n * t) - 1) / (r/n));
  return fv;
}

export default function ComparisonDashboard() {
  const { currency, exchangeRate } = useCurrency();
  
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', name: 'Coffee', amount: '5', frequency: 'daily' },
    { id: '2', name: 'Streaming Subs', amount: '30', frequency: 'monthly' }
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState<InvestmentCategory>('All');
  const [displayTotalWealth, setDisplayTotalWealth] = useState(0);

  const [assetReturns, setAssetReturns] = useState<Record<string, number>>(DEFAULT_ASSET_RETURNS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleReturnChange = (asset: string, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setAssetReturns(prev => ({ ...prev, [asset]: parseFloat(value) || 0 }));
    }
  };

  const INVESTMENTS: Investment[] = useMemo(() => {
    return BASE_INVESTMENTS.map(base => ({
      ...base,
      annualReturnPct: assetReturns[base.name] || 0
    }));
  }, [assetReturns]);

  // --- Derived State ---
  const totalMonthlySpending = useMemo(() => {
    return expenses.reduce((acc, curr) => {
      const amt = parseFloat(curr.amount) || 0;
      if (curr.frequency === 'daily') return acc + (amt * 30);
      if (curr.frequency === 'weekly') return acc + (amt * 4.33);
      return acc + amt;
    }, 0);
  }, [expenses]);

  const totalYearlySpending = totalMonthlySpending * 12;
  const totalInvested = totalYearlySpending * INVESTMENT_YEARS;

  const filteredInvestments = useMemo(() => {
    if (selectedCategory === 'All') return INVESTMENTS;
    return INVESTMENTS.filter(inv => inv.category === selectedCategory);
  }, [selectedCategory, INVESTMENTS]);

  const bestReturnInv = useMemo(() => {
    if (filteredInvestments.length === 0) return null;
    return [...filteredInvestments].sort((a, b) => b.annualReturnPct - a.annualReturnPct)[0];
  }, [filteredInvestments]);

  const safestInv = useMemo(() => {
    const lows = filteredInvestments.filter(i => i.riskLevel === 'Low');
    if (lows.length === 0) return null;
    return lows.sort((a, b) => b.annualReturnPct - a.annualReturnPct)[0];
  }, [filteredInvestments]);

  const balancedInv = useMemo(() => {
    const meds = filteredInvestments.filter(i => i.riskLevel === 'Medium');
    if (meds.length === 0) return null;
    return meds.sort((a, b) => b.annualReturnPct - a.annualReturnPct)[0];
  }, [filteredInvestments]);

  const totalPotentialWealth = useMemo(() => {
    if (!bestReturnInv) return 0;
    return calculateFutureValue(totalMonthlySpending, bestReturnInv.annualReturnPct, INVESTMENT_YEARS);
  }, [totalMonthlySpending, bestReturnInv]);

  // --- Animations ---
  useEffect(() => {
    if (totalPotentialWealth === displayTotalWealth) return;
    const duration = 1000;
    const steps = 30;
    const stepTime = duration / steps;
    const diff = totalPotentialWealth - displayTotalWealth;
    const increment = diff / steps;
    
    let current = displayTotalWealth;
    let stepCount = 0;
    
    const timer = setInterval(() => {
      stepCount++;
      current += increment;
      if (stepCount >= steps) {
        setDisplayTotalWealth(totalPotentialWealth);
        clearInterval(timer);
      } else {
        setDisplayTotalWealth(current);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [totalPotentialWealth, displayTotalWealth]);

  // --- Handlers ---
  const addExpense = () => {
    setExpenses([...expenses, { id: Date.now().toString(), name: 'New Expense', amount: '0', frequency: 'monthly' }]);
  };

  const updateExpense = (id: string, field: keyof Expense, value: string) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden font-sans pb-32">
      <div className="bg-mesh" />

      {/* NAVBAR */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-[1400px] mx-auto border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <img src="/icon.png" alt="WouldIBeRich Logo" className="w-8 h-8 object-contain rounded-lg" />
          <span className="font-bold text-xl tracking-tight text-white hidden md:block">WouldIBeRich</span>
        </Link>
        <div className="flex items-center gap-4">
          <MarketStatusBadge />
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="glass-panel px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 text-white hover:bg-white/10 transition-colors"
          >
            <Settings size={14} /> Returns
          </button>
                    <Link href="/">
            <button className="glass-panel px-5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 text-white hover:bg-white/10 transition-colors">
              Home
            </button>
          </Link>
        </div>
      </nav>

      {/* SETTINGS MODAL */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#070B1A]/80 backdrop-blur-sm" onClick={() => setIsSettingsOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0F172A] border border-white/10 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Historical Data Entry</h2>
                  <p className="text-xs text-gray-400 mt-1">Adjust the expected annual return % for each asset class.</p>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-white p-2 bg-white/5 rounded-full transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-3">
                {Object.entries(assetReturns).map(([asset, val]) => (
                  <div key={asset} className="flex items-center justify-between glass-panel p-3 rounded-xl border border-white/5">
                    <span className="text-sm font-bold text-white">{asset}</span>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={val}
                        onChange={(e) => handleReturnChange(asset, e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-md px-3 py-1 text-right text-sm text-white font-bold w-20 outline-none focus:border-[#EC4899]"
                      />
                      <span className="text-gray-400 text-sm">% / yr</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <button onClick={() => { setAssetReturns(DEFAULT_ASSET_RETURNS); setIsSettingsOpen(false); }} className="text-xs text-gray-400 hover:text-white mr-4 transition-colors">Reset Defaults</button>
                <button onClick={() => setIsSettingsOpen(false)} className="bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">Save & Close</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="relative z-10 px-6 pt-8 max-w-[1400px] mx-auto">
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
              The Lost <span className="text-gradient">Opportunity</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Compare how your daily expenses would perform across various asset classes over {INVESTMENT_YEARS} years.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: EXPENSE TRACKER */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-3xl sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <PieChart size={18} className="text-[#EC4899]" /> Your Expenses
                </h2>
                <button 
                  onClick={addExpense}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-2 mb-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {expenses.map((expense) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass-panel p-2.5 rounded-xl flex flex-col gap-1.5 border border-white/10 focus-within:border-white/30 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={expense.name}
                          onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                          placeholder="Expense Name"
                          className="bg-transparent border-none text-white font-bold text-xs w-full outline-none"
                        />
                        <button onClick={() => deleteExpense(expense.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-white/5 rounded-md border border-white/10 px-2 py-1 flex-1">
                          <span className="text-gray-400 text-xs mr-1">{currency === 'USD' ? '$' : '₹'}</span>
                          <input
                            type="text"
                            value={expense.amount}
                            onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)}
                            placeholder="0"
                            className="bg-transparent border-none text-white text-xs w-full outline-none font-bold"
                          />
                        </div>
                        <select 
                          value={expense.frequency}
                          onChange={(e) => updateExpense(expense.id, 'frequency', e.target.value)}
                          className="bg-white/5 border border-white/10 text-gray-300 text-[10px] rounded-md px-1.5 py-1.5 outline-none cursor-pointer"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Total Monthly:</span>
                  <span className="text-white font-bold">{formatCurrency(totalMonthlySpending, false, currency)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">Total Yearly:</span>
                  <span className="text-white font-bold">{formatCurrency(totalYearlySpending, false, currency)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: INVESTMENTS & FILTERS */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* TOP FILTER */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                    selectedCategory === cat 
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white shadow-lg shadow-[#8B5CF6]/20' 
                    : 'glass-panel text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* INVESTMENT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredInvestments.map((inv) => {
                  const fv = calculateFutureValue(totalMonthlySpending, inv.annualReturnPct, INVESTMENT_YEARS);
                  const isPositive = fv > totalInvested;
                  
                  return (
                    <motion.div
                      key={inv.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="group relative h-40"
                      style={{ perspective: '1000px' }}
                    >
                      {/* Inner Card (handles the flip) */}
                      <div className="w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                        
                        {/* FRONT FACE */}
                        <div className="absolute inset-0 backface-hidden">
                          <div className="glass-panel w-full h-full p-4 rounded-xl flex flex-col justify-between overflow-hidden">
                            <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${inv.color} rounded-full blur-[40px] opacity-60`} />
                            
                            <div className="flex justify-between items-start relative z-10">
                              <div className="min-w-0 pr-2 flex-1">
                                <h3 className="font-bold text-white text-[11px] leading-tight break-words">{inv.name}</h3>
                                <div className="text-[9px] text-gray-400 truncate mt-0.5">{inv.category}</div>
                              </div>
                              <div className="flex flex-col items-end shrink-0 pl-1">
                                <div className={`text-[11px] font-black ${isPositive ? 'text-[#00F5A0]' : 'text-gray-300'}`}>
                                  {inv.annualReturnPct}% / yr
                                </div>
                                <div className={`text-[8px] px-1.5 py-0.5 mt-1 rounded-full uppercase tracking-wider font-bold ${
                                  inv.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' : 
                                  inv.riskLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                                  'bg-green-500/20 text-green-400'
                                }`}>
                                  {inv.riskLevel}
                                </div>
                              </div>
                            </div>

                            <div className="relative z-10 mt-auto pt-2 border-t border-white/5">
                              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Total Value ({INVESTMENT_YEARS} yrs)</div>
                              <div className="text-lg font-black text-white">
                                {formatCurrency(fv, false, currency)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* BACK FACE (Hover Journey) */}
                        <div className="absolute inset-0 backface-hidden [transform:rotateY(180deg)]">
                          <div className="glass-panel w-full h-full p-4 rounded-xl flex flex-col justify-center items-center text-center bg-gradient-to-br from-white/10 to-transparent border border-[#8B5CF6]/30 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Transformation Journey</div>
                            
                            <div className="flex items-center justify-center gap-2 w-full">
                              <div className="flex-1">
                                <div className="text-xs font-bold text-white">{formatCurrency(totalInvested, false, currency)}</div>
                                <div className="text-[9px] text-gray-400">Total Invested</div>
                              </div>
                              
                              <ArrowRight size={14} className="text-[#8B5CF6]" />
                              
                              <div className="flex-1">
                                <div className="text-sm font-black text-[#00F5A0]">{formatCurrency(fv, false, currency)}</div>
                                <div className="text-[9px] text-[#00F5A0]/80">Final Value</div>
                              </div>
                            </div>
                            
                            <div className="mt-2 text-[10px] text-gray-300 italic">
                              &quot;By skipping the expenses, you turned your habits into {inv.name} wealth.&quot;
                            </div>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            
            {filteredInvestments.length === 0 && (
              <div className="glass-panel p-10 text-center rounded-3xl">
                <p className="text-gray-400">No investments found for this category.</p>
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM SUMMARY */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 glass-panel p-6 rounded-[30px] border border-white/10 mb-12 shadow-[0_0_50px_rgba(139,92,246,0.15)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6]/5 to-transparent" />
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            
            <div className="md:col-span-1 md:border-r border-white/10 md:pr-6">
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-0.5">Total Potential Wealth</h3>
              <p className="text-[10px] text-gray-400 mb-1.5">If you took the best return ({bestReturnInv?.name})</p>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F5A0] via-[#3B82F6] to-[#8B5CF6] drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 20px rgba(0, 245, 160, 0.4))' }}>
                {formatCurrency(displayTotalWealth, false, currency)}
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <h4 className="text-[9px] font-bold text-[#8B5CF6] uppercase tracking-widest">Best Return</h4>
              <div className="text-xs font-bold text-white">{bestReturnInv?.name || '-'}</div>
              <div className="text-[10px] text-gray-400">{bestReturnInv?.annualReturnPct}% / yr</div>
            </div>

            <div className="flex flex-col gap-0.5">
              <h4 className="text-[9px] font-bold text-[#14B8A6] uppercase tracking-widest">Safest Option</h4>
              <div className="text-xs font-bold text-white">{safestInv?.name || '-'}</div>
              <div className="text-[10px] text-gray-400">{safestInv?.annualReturnPct}% / yr (Low Risk)</div>
            </div>

            <div className="flex flex-col gap-0.5">
              <h4 className="text-[9px] font-bold text-[#F59E0B] uppercase tracking-widest">Balanced Choice</h4>
              <div className="text-xs font-bold text-white">{balancedInv?.name || '-'}</div>
              <div className="text-[10px] text-gray-400">{balancedInv?.annualReturnPct}% / yr (Med Risk)</div>
            </div>

          </div>
        </motion.div>

      </main>

      <DisclaimerWarning />

      {/* Global CSS for 3D flip card utility */}
      <style dangerouslySetInnerHTML={{__html: `
        .backface-hidden {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
      `}} />
    </div>
  );
}
