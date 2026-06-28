'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Bitcoin, TrendingUp, Home, CreditCard, DollarSign, Activity, Menu, X } from 'lucide-react';
import { useCurrency } from '@/lib/CurrencyContext';
import { formatCurrency } from '@/utils/formatCurrency';
import DisclaimerWarning from '@/components/DisclaimerWarning';
import MarketStatusBadge from '@/components/MarketStatusBadge';

const popularScenariosData = [
  { title: 'Bitcoin in 2015', gainPct: 34500, icon: <Bitcoin size={20} />, category: 'Crypto' },
  { title: 'NVIDIA in 2015', gainPct: 12400, icon: <Activity size={20} />, category: 'Stocks' },
  { title: 'Coffee Investing', gainPct: 450, icon: <DollarSign size={20} />, category: 'Habits' },
  { title: 'Austin Real Estate', gainPct: 280, icon: <Home size={20} />, category: 'Real Estate' },
  { title: 'College Fund', gainPct: 180, icon: <TrendingUp size={20} />, category: 'Investing' },
  { title: 'Credit Card Debt', gainAmount: -45000, icon: <CreditCard size={20} />, category: 'Debt', isNegative: true },
];

const categoriesData = [
  { name: 'Crypto', subtitle: 'Explore missed moonshots', icon: <Bitcoin size={24} className="text-[#8B5CF6]" /> },
  { name: 'Stocks', subtitle: 'See long-term gains', icon: <TrendingUp size={24} className="text-[#EC4899]" /> },
  { name: 'Real Estate', subtitle: 'Property vs regret', icon: <Home size={24} className="text-[#F59E0B]" /> },
  { name: 'Spending Habits', subtitle: 'Tiny habits, huge impact', icon: <CreditCard size={24} className="text-[#8B5CF6]" /> },
];

export default function LandingUI() {
  const { currency, setCurrency, exchangeRate } = useCurrency();
  const [modalContent, setModalContent] = React.useState<'privacy' | 'terms' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden font-sans">
      <div className="bg-mesh" />

      {/* SECTION 1 — NAVBAR */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2 z-10 relative">
          <img src="/icon.png" alt="WouldIBeRich Logo" className="w-8 h-8 object-contain rounded-lg" />
          <span className="font-bold text-xl tracking-tight text-white">WouldIBeRich</span>
        </div>
        
        {/* CENTERED LINKS */}
        <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-8 text-sm font-medium text-gray-300 pointer-events-auto">
            <Link href="/scenarios" className="hover:text-white transition-colors">Scenarios</Link>
            <Link href="/spending-personality" className="hover:text-white transition-colors font-bold text-[#EC4899]">Spending Personality</Link>
            <Link href="/compare" className="hover:text-white transition-colors font-bold text-[#00F5A0]">The Lost Opportunity</Link>
            <Link href="/how-it-works" className="hover:text-white transition-colors">How It Works</Link>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div className="ml-auto md:ml-0 mr-4 z-10 relative">
          <MarketStatusBadge />
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="md:hidden z-10 relative">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2 focus:outline-none">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-[#0F172A]/95 backdrop-blur-xl border-b border-white/10 py-4 px-6 flex flex-col gap-4 z-40 shadow-2xl">
          <Link href="/scenarios" onClick={() => setMobileMenuOpen(false)} className="text-white font-medium text-lg">Scenarios</Link>
          <Link href="/spending-personality" onClick={() => setMobileMenuOpen(false)} className="text-[#EC4899] font-bold text-lg">Spending Personality</Link>
          <Link href="/compare" onClick={() => setMobileMenuOpen(false)} className="text-[#00F5A0] font-bold text-lg">The Lost Opportunity</Link>
          <Link href="/how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-white font-medium text-lg">How It Works</Link>
        </div>
      )}

      {/* SECTION 2 — HERO SECTION */}
      <main className="relative z-10 px-6 pt-4 md:pt-16 pb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT SIDE */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 w-fit backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" />
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Financial Identity</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Discover your <br/>
              <span className="text-gradient">financial alter-ego</span>.
            </h1>

            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              Are you a Coffee Investor or a Crypto Gambler? Take our interactive quiz to analyze your past habits and find your true spending personality.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Link
                href="/spending-personality"
                className="btn-primary px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 hover:scale-105 transition-transform"
              >
                Take the Quiz <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>

          {/* RIGHT SIDE (Spending Personality Experience) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] flex items-center justify-center mt-12 lg:mt-0"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20 rounded-[40px] blur-3xl opacity-50 pointer-events-none" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#8B5CF6] rounded-full blur-[80px] opacity-30" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#F59E0B] rounded-full blur-[80px] opacity-30" />
            
            {/* Main Central Sphere/Glow */}
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-[#8B5CF6]/10 to-[#EC4899]/10 border border-white/10 backdrop-blur-3xl flex items-center justify-center relative z-10 shadow-[0_0_80px_rgba(236,72,153,0.15)]">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] opacity-30 blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="absolute text-center">
                <div className="text-sm font-bold text-white uppercase tracking-[0.2em] opacity-80">Who Are You?</div>
              </div>
            </div>

            {/* Floating Card 1: The Crypto Gambler */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-10 left-0 lg:-left-12 glass-panel border border-white/10 rounded-2xl p-3 md:p-4 z-20 flex items-center gap-3 md:gap-4 shadow-2xl hover:scale-105 transition-transform cursor-pointer scale-90 md:scale-100 origin-left"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
                <Bitcoin size={24} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">The Crypto Gambler</div>
                <div className="text-xs text-[#F59E0B] font-semibold mt-0.5">High Risk Tolerance</div>
              </div>
            </motion.div>

            {/* Floating Card 2: The Coffee Investor */}
            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-[65%] md:top-1/2 -translate-y-1/2 -right-6 md:-right-4 lg:-right-24 xl:-right-32 glass-panel border border-white/10 rounded-2xl p-3 md:p-4 z-30 flex items-center gap-3 md:gap-4 shadow-2xl hover:scale-105 transition-transform cursor-pointer scale-90 md:scale-100 origin-right"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                <DollarSign size={24} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">The Coffee Investor</div>
                <div className="text-xs text-[#8B5CF6] font-semibold mt-0.5">Micro-investor</div>
              </div>
            </motion.div>

            {/* Floating Card 3: The Frugal Saver */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-0 md:bottom-10 left-4 md:left-10 lg:left-0 glass-panel border border-white/10 rounded-2xl p-3 md:p-4 z-20 flex items-center gap-3 md:gap-4 shadow-2xl hover:scale-105 transition-transform cursor-pointer scale-90 md:scale-100 origin-left"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#00F5A0]/20 flex items-center justify-center text-[#00F5A0]">
                <Home size={24} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">The Frugal Saver</div>
                <div className="text-xs text-[#00F5A0] font-semibold mt-0.5">Avoids Debt Completely</div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </main>

      {/* SECTION 3 — POPULAR SCENARIOS */}
      <section id="scenarios" className="relative z-10 px-6 py-24 max-w-7xl mx-auto border-t border-white/5">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Popular What-If Scenarios</h2>
          <p className="text-gray-400 text-lg">Explore the most mind-blowing financial what-ifs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularScenariosData.map((scenario, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-6 rounded-2xl flex items-center justify-between hover-lift group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-300 group-hover:text-white transition-colors group-hover:scale-110 duration-300">
                  {scenario.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gradient transition-all">{scenario.title}</h3>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{scenario.category}</div>
                </div>
              </div>
              <div className={`font-bold ${scenario.isNegative ? 'text-[#FF3B3B]' : 'text-[#00F5A0]'}`}>
                {scenario.gainPct !== undefined 
                  ? `+${scenario.gainPct.toLocaleString()}%` 
                  : formatCurrency(scenario.gainAmount!, false, currency, exchangeRate)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4 — CATEGORY PREVIEW */}
      <section id="categories" className="relative z-10 px-6 py-16 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Find Your Reality</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">Dive into specific domains to see where you missed out, or where you dodged a bullet.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesData.map((cat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 group cursor-pointer relative overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-white relative z-10">{cat.name}</h3>
              <p className="text-sm text-gray-400 relative z-10 italic">"{cat.subtitle}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      <DisclaimerWarning />

      {/* SECTION 5 — FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-[#070B1A]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="WouldIBeRich Logo" className="w-6 h-6 object-contain rounded-md" />
            <span className="font-bold text-lg text-white">WouldIBeRich</span>
          </div>
          
          <div className="flex gap-6 text-sm font-medium text-gray-400">
            <button onClick={() => setModalContent('privacy')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => setModalContent('terms')} className="hover:text-white transition-colors">Terms</button>
          </div>
          
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} WouldIBeRich. All rights reserved.
          </div>
        </div>
      </footer>

      {/* MODAL */}
      {modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#070B1A]/80 backdrop-blur-sm" onClick={() => setModalContent(null)}>
          <div 
            className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 max-w-3xl w-full max-h-[85vh] overflow-y-auto relative shadow-2xl shadow-[#8B5CF6]/20" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-6 right-6 text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              onClick={() => setModalContent(null)}
            >
              ✕
            </button>
            <div className="text-gray-300 space-y-4 text-sm leading-relaxed">
              {modalContent === 'privacy' && (
                <>
                  <h1 className="text-2xl font-bold text-white mb-6">Privacy Policy</h1>
                  <p>At WouldIBeRich, your privacy matters. This platform is designed to help users explore hypothetical financial scenarios and understand how small spending habits may impact long-term wealth creation. We are committed to collecting as little personal information as possible while providing an engaging and educational experience.</p>
                  <p>We do not require users to create an account, provide personal identification details, or share sensitive financial information to use the core features of this website. Any spending amounts, investment selections, or simulation inputs entered into the platform are used solely to generate the requested calculations and visualizations.</p>
                  <p>The information displayed by the platform is based on historical market data, estimated return rates, and user-provided inputs. These calculations are processed automatically and are not linked to your personal identity. We do not sell, rent, or share your information with advertisers, brokers, or third parties for marketing purposes.</p>
                  <p>To improve platform performance and user experience, we may collect limited anonymous analytics such as page visits, feature usage statistics, browser type, device information, and error logs. This information is aggregated and cannot be used to personally identify individual users.</p>
                  <p>The website may use cookies or similar technologies to remember preferences such as theme settings, selected currency (USD/INR), or other interface customizations. These cookies are used solely to enhance usability and do not contain sensitive personal information.</p>
                  <p>While we take reasonable measures to protect the information processed by the platform, no internet-based service can guarantee absolute security. Users should avoid entering confidential financial, banking, or personally identifiable information into any input fields.</p>
                  <p>By using this website, you acknowledge that the simulations and insights provided are for educational and informational purposes only. Continued use of the platform constitutes acceptance of this Privacy Policy and any future updates made to improve transparency, security, or compliance.</p>
                </>
              )}
              {modalContent === 'terms' && (
                <>
                  <h1 className="text-2xl font-bold text-white mb-6">Terms of Use</h1>
                  <p>Welcome to WouldIBeRich. By accessing or using this website, you agree to comply with and be bound by the following Terms of Use. If you do not agree with any part of these terms, please discontinue use of the platform.</p>
                  <p>WouldIBeRich is an educational and informational tool designed to help users explore hypothetical financial scenarios based on historical market data, estimated return rates, and user-provided inputs. The content, calculations, projections, and visualizations presented on this website are for illustrative purposes only and should not be interpreted as financial, investment, legal, tax, or professional advice.</p>
                  <p>While we strive to provide accurate calculations and reliable data, we do not guarantee the accuracy, completeness, or timeliness of any information displayed. Historical performance is not indicative of future results, and actual investment outcomes may differ significantly from the estimates shown by the platform.</p>
                  <p>Users are solely responsible for any decisions made based on information obtained through this website. We strongly recommend consulting qualified financial professionals before making investment, savings, or financial planning decisions.</p>
                  <p>You agree not to misuse the platform, attempt unauthorized access to systems, interfere with website functionality, distribute malicious software, or use the service for unlawful purposes. Any such activity may result in restricted access or legal action where applicable.</p>
                  <p>All website content, including text, design elements, graphics, branding, logos, and software components, is protected by applicable intellectual property laws. Unauthorized copying, reproduction, redistribution, or commercial use of any content without permission is prohibited.</p>
                  <p>The platform may be updated, modified, suspended, or discontinued at any time without prior notice. We reserve the right to revise these Terms of Use whenever necessary. Continued use of the website after updates constitutes acceptance of the revised terms.</p>
                  <p>By using WouldIBeRich, you acknowledge that the platform is provided on an "as is" and "as available" basis, without warranties of any kind, and that your use of the service is entirely at your own risk.</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
