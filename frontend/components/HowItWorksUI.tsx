'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Bitcoin, TrendingUp, Home, CreditCard, DollarSign, Activity,
  Coffee, Utensils, Car, Sparkles, PieChart, ShieldCheck 
} from 'lucide-react';
import DisclaimerWarning from '@/components/DisclaimerWarning';
import MarketStatusBadge from '@/components/MarketStatusBadge';

const timelineColors = [
  "#8B5CF6", // Purple
  "#9F4DF0",
  "#B33EEA",
  "#C730E4",
  "#DB21DD",
  "#EC4899", // Pink
  "#D2749E",
  "#97A09F",
  "#4CD1A0",
  "#00F5A0"  // Emerald
];

const timelineSteps = [
  {
    title: "Confront Your Expenses",
    desc: "Gather your everyday receipts—whether it's the daily Chai Tapri, quick Zomato food deliveries, streaming packages, or Uber surge rides.",
    icon: <Activity size={18} />
  },
  {
    title: "Enter the Alter-Ego Quiz",
    desc: "Click 'Take the Quiz' on the homepage to start your localized 50-question Indian spending personality journey.",
    icon: <TrendingUp size={18} />
  },
  {
    title: "Slide 1: Daily Habits",
    desc: "Log your daily cravings like lassi, office samosas, energy drinks, and bakery khari. See how micro-spending builds up.",
    icon: <Coffee size={18} />
  },
  {
    title: "Slides 2 & 3: Food & Subs",
    desc: "Input Swiggy order costs, Google One storage fees, gym subscriptions, and premium dating apps to audit your digital life.",
    icon: <Utensils size={18} />
  },
  {
    title: "Slides 4 & 5: Lifestyle",
    desc: "Enter Ola/Uber fees, toll taxes, Myntra sales shopping, sneaker drops, and BookMyShow internet fees.",
    icon: <Car size={18} />
  },
  {
    title: "Unleash the Reality Roast",
    desc: "Get roasted by our system based on your single biggest offender. Discover whether you're a Crypto Gambler or Coffee Investor.",
    icon: <Sparkles size={18} />
  },
  {
    title: "Track Global Missed Wealth",
    desc: "See the global 'Alternate Reality' compound calculation at the bottom. Watch how small savings grow over years of market returns.",
    icon: <DollarSign size={18} />
  },
  {
    title: "Compare Asset Classes",
    desc: "Go to The Lost Opportunity dashboard. Filter opportunities across Bitcoin, Nifty 50, Stocks, Gold, and Government schemes.",
    icon: <PieChart size={18} />
  },
  {
    title: "Visualize Your Journey",
    desc: "Hover over investment cards to flip them. Compare 'Total Invested' against 'Final Value' to see the compound interest magic.",
    icon: <ArrowRight size={18} />
  },
  {
    title: "Redirect Your Cashflow",
    desc: "Use the 'Safest Option' vs 'Best Return' summary metrics to make smarter real-world investment decisions. Start your journey today!",
    icon: <ShieldCheck size={18} />
  }
];

export default function HowItWorksUI() {
  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden font-sans">
      <div className="bg-mesh" />

      {/* NAVBAR */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 z-10 relative">
          <img src="/icon.png" alt="WouldIBeRich Logo" className="w-8 h-8 object-contain rounded-lg" />
          <span className="font-bold text-xl tracking-tight text-white">WouldIBeRich</span>
        </Link>
        
        {/* CENTERED LINKS */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-8 text-sm font-medium text-gray-300 pointer-events-auto">
            <Link href="/#scenarios" className="hover:text-white transition-colors">Scenarios</Link>
            <Link href="/spending-personality" className="hover:text-white transition-colors font-bold text-[#EC4899]">Spending Personality</Link>
            <Link href="/compare" className="hover:text-white transition-colors font-bold text-[#00F5A0]">The Lost Opportunity</Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors text-white font-semibold">How It Works</Link>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="ml-auto md:ml-0 mr-4 z-10 relative">
          <MarketStatusBadge />
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden z-10 relative">
                  </div>
      </nav>

      {/* TIMELINE SECTION */}
      <main className="relative z-10 px-6 py-16 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 w-fit backdrop-blur-md mb-4">
            <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse" />
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Your Financial Journey</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
            How It <span className="text-gradient">Works</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A step-by-step roadmap to auditing your real-life spending habits and unlocking your wealth potential.
          </p>
        </div>

        <div className="relative">
          {/* Straight connecting gradient line for mobile, hidden on desktop */}
          <div className="absolute left-4 md:hidden -translate-x-[1px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#8B5CF6] via-[#EC4899] to-[#00F5A0] opacity-35" />
          
          <div className="space-y-0 relative z-10">
            {timelineSteps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className="relative flex flex-col md:flex-row items-stretch w-full min-h-[160px]">
                  
                  {/* Curved Serpentine SVG background segments for desktop */}
                  <div className="absolute inset-0 pointer-events-none hidden md:block z-0">
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
                      <defs>
                        <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor={timelineColors[index]} />
                          <stop offset="100%" stopColor={timelineColors[index + 1] || timelineColors[index]} />
                        </linearGradient>
                        <filter id={`glow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="2" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>
                      <path 
                        d={isEven 
                          ? "M 50,0 C 50,15 30,15 30,50 C 30,85 50,85 50,100" 
                          : "M 50,0 C 50,15 80,15 80,50 C 80,85 50,85 50,100"
                        } 
                        stroke={`url(#grad-${index})`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        filter={`url(#glow-${index})`}
                        className="opacity-30"
                      />
                    </svg>
                  </div>

                  {/* Layout block */}
                  <div className={`flex flex-col md:flex-row items-center justify-between w-full relative z-10 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* Content Card Side */}
                    <div className="w-full md:w-[calc(50%-40px)] pl-12 md:pl-0">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="glass-panel p-5 rounded-2xl hover-lift relative group overflow-hidden border border-white/5 hover:border-white/10 transition-all"
                      >
                        <div className="absolute -inset-10 bg-gradient-to-r from-[#8B5CF6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300" style={{ color: timelineColors[index] }}>
                            {step.icon}
                          </div>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: timelineColors[index] }}>Step {index + 1}</span>
                            <h3 className="text-sm font-bold text-white group-hover:text-gradient transition-all">{step.title}</h3>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                      </motion.div>
                    </div>

                    {/* Central Node Dot */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center justify-center z-20">
                      <div 
                        className="w-7 h-7 rounded-full bg-[#070B1A] border-2 flex items-center justify-center text-white font-bold text-xs transition-transform duration-300 hover:scale-110" 
                        style={{ 
                          borderColor: timelineColors[index], 
                          boxShadow: `0 0 12px ${timelineColors[index]}` 
                        }}
                      >
                        {index + 1}
                      </div>
                    </div>

                    {/* Empty spacer to balance layout on desktop */}
                    <div className="hidden md:block w-[calc(50%-40px)]" />

                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </main>

      <DisclaimerWarning />


    </div>
  );
}
