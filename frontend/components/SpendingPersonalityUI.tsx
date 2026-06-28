'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, Pizza, Tv, Car, ArrowRight, TrendingUp, ChevronRight, ChevronLeft,
  Droplet, Zap, CupSoda, Apple, Cookie, Package, Cigarette, Croissant, Utensils,
  Wine, GlassWater, Beef, Carrot, Store, Dumbbell, Smartphone, Cloud, Key, ShoppingCart, Newspaper, Gamepad2, Monitor, ParkingCircle, Navigation, Bike, Fuel, Plane, Truck, Shirt, Watch, Sparkles, Laptop, Ticket, Scissors, Dog, Home, Settings, X
} from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/lib/CurrencyContext';
import { formatCurrency } from '@/utils/formatCurrency';
import DisclaimerWarning from '@/components/DisclaimerWarning';

type Frequency = 'monthly' | '3_months' | '6_months' | 'yearly';

interface CategoryConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  subtitle: string;
  investment: string;
  defaultYears: number;
  roast: string;
  cardColor: string;
  slide: number;
}

const C = (
  id: string, name: string, icon: React.ReactNode, subtitle: string, investment: string, 
  defaultYears: number, roast: string, cardColor: string, slide: number
): CategoryConfig => ({ id, name, icon, subtitle, investment, defaultYears, roast, cardColor, slide });

const CATEGORIES: CategoryConfig[] = [
  // SLIDE 1: Daily Habits (1-10)
  C('coffee', 'Coffee/Tea', <Coffee size={18} />, 'Daily caffeine', 'Gold', 4, 'Your coffee habit almost became jewelry.', 'from-[#8B5CF6]/20 to-transparent', 1),
  C('water', 'Bisleri/Kinley', <Droplet size={18} />, 'Bottled water', 'Nifty 50', 5, 'Tap water with RO is practically free, you know.', 'from-[#3B82F6]/20 to-transparent', 1),
  C('softdrinks', 'Soft Drinks', <Zap size={18} />, 'Coke/Pepsi', 'TCS', 5, 'You funded IT just to stay awake.', 'from-[#10B981]/20 to-transparent', 1),
  C('boba', 'Lassi & Falooda', <CupSoda size={18} />, 'Sweet cravings', 'Reliance', 5, 'Those dry fruits could have been Reliance shares.', 'from-[#F472B6]/20 to-transparent', 1),
  C('smoothie', 'Fresh Juice', <Apple size={18} />, 'Overpriced juices', 'Bitcoin', 5, 'Liquid sugar over decentralized currency.', 'from-[#F59E0B]/20 to-transparent', 1),
  C('snacks', 'Samosa/Kachori', <Cookie size={18} />, 'Office snacks', 'Tata Motors', 5, 'Snacking away a Nexon down payment.', 'from-[#6366F1]/20 to-transparent', 1),
  C('vending', 'Chips/Kurkure', <Package size={18} />, 'Mid-day munchies', 'Gold', 4, 'Junk food instead of physical gold.', 'from-[#EF4444]/20 to-transparent', 1),
  C('bakery', 'Bakery Puffs', <Croissant size={18} />, 'Khari & biscuits', 'Index Funds', 5, 'A buttery path to being broke.', 'from-[#FBBF24]/20 to-transparent', 1),
  C('fastfood', 'Vada Pav/Rolls', <Utensils size={18} />, 'Quick street food', 'Real Estate', 5, 'You ate the down payment on a flat.', 'from-[#F87171]/20 to-transparent', 1),

  // SLIDE 2: Food & Dining (11-20)
  C('delivery', 'Zomato/Swiggy', <Pizza size={18} />, 'Food Delivery', 'Nifty 50', 6, 'Those delivery fees could have bought shares.', 'from-[#EC4899]/20 to-transparent', 2),
  C('swiggyone', 'Swiggy One', <ShoppingCart size={18} />, 'Free food delivery', 'Amazon', 9, 'You paid them to pay them faster.', 'from-[#F59E0B]/20 to-transparent', 2),
  C('finedining', '5-Star Dining', <Wine size={18} />, 'Fancy dinners', 'Bitcoin', 6, 'Eating like a king, investing like a peasant.', 'from-[#8B5CF6]/20 to-transparent', 2),
  C('latenight', 'Midnight Biryani', <GlassWater size={18} />, 'Post-party eats', 'Infosys', 6, 'Drunk eating cost you a laptop.', 'from-[#14B8A6]/20 to-transparent', 2),
  C('worklunch', 'Office Thali', <Beef size={18} />, 'Corporate lunches', 'Tata Motors', 6, 'A ₹250 thali every day adds up to a car.', 'from-[#22C55E]/20 to-transparent', 2),
  C('takeout', 'Takeout Dinners', <Package size={18} />, 'Too tired to cook', 'TCS', 6, 'Convenience tax is the highest tax.', 'from-[#F59E0B]/20 to-transparent', 2),
  C('happyhour', 'Pubs/Breweries', <Wine size={18} />, 'Drinks with friends', 'Gold', 6, 'Liquidating your assets literally.', 'from-[#D946EF]/20 to-transparent', 2),
  C('brunch', 'Sunday Brunch', <Utensils size={18} />, 'Weekend buffets', 'Real Estate', 6, 'Unlimited food, limited wealth.', 'from-[#A3E635]/20 to-transparent', 2),
  C('outing', 'Friends & Family Outing', <Wine size={18} />, 'Group dinners & events', 'S&P 500', 6, 'You paid the bill to flex, and now you are broke.', 'from-[#F87171]/20 to-transparent', 2),
  C('convenience', 'Blinkit/Zepto', <Store size={18} />, '10-min groceries', 'Reliance', 6, 'The quick-commerce tax is real.', 'from-[#FCD34D]/20 to-transparent', 2),

  // SLIDE 3: Subscriptions & Digital (21-30)
  C('netflix', 'Hotstar/Netflix', <Tv size={18} />, 'Streaming subs', 'Reliance', 9, 'Streaming 5 shows at once cost you a cinema.', 'from-[#EF4444]/20 to-transparent', 3),
  C('prime', 'Amazon Prime', <Tv size={18} />, 'Entertainment/Shopping', 'Amazon', 9, 'Next day delivery of things you dont need.', 'from-[#3B82F6]/20 to-transparent', 3),
  C('music', 'Spotify/JioSaavn', <Tv size={18} />, 'Music Subs', 'Nifty 50', 9, 'You could have hired a personal singer.', 'from-[#10B981]/20 to-transparent', 3),
  C('youtube', 'YouTube Premium', <Tv size={18} />, 'Ad-free viewing', 'S&P 500', 9, 'Paying to skip 5 seconds of ads.', 'from-[#EF4444]/20 to-transparent', 3),
  C('gym', 'Cult.fit/Gym', <Dumbbell size={18} />, 'Unused membership', 'Bitcoin', 9, 'Paying to NOT lift weights is crazy.', 'from-[#6366F1]/20 to-transparent', 3),
  C('apps', 'Bumble/Tinder', <Smartphone size={18} />, 'Premium dating', 'TCS', 9, 'You bought premium just to swipe left.', 'from-[#F43F5E]/20 to-transparent', 3),
  C('cloud', 'Google One/iCloud', <Cloud size={18} />, 'Cloud Storage', 'Index Funds', 9, 'Paying rent for digital photos.', 'from-[#3B82F6]/20 to-transparent', 3),
  C('news', 'Newspaper/Digital News', <Newspaper size={18} />, 'The Hindu/ET', 'Gold', 9, 'Paying to read bad news.', 'from-[#6B7280]/20 to-transparent', 3),
  C('games', 'Games', <Gamepad2 size={18} />, 'In-app purchases', 'Microsoft', 9, 'Digital skins instead of real assets.', 'from-[#8B5CF6]/20 to-transparent', 3),
  C('cable', 'DTH/Cable', <Tv size={18} />, 'TataPlay/D2H', 'Nifty 50', 9, 'You pay to watch ads?', 'from-[#64748B]/20 to-transparent', 3),

  // SLIDE 4: Transport & Convenience (31-40)
  C('uber', 'Ola/Uber', <Car size={18} />, 'Ride sharing', 'Tata Motors', 5, 'You paid surge pricing instead of buying the car.', 'from-[#F59E0B]/20 to-transparent', 4),
  C('parking', 'Mall Parking', <ParkingCircle size={18} />, 'City parking', 'Real Estate', 5, 'Renting concrete by the hour.', 'from-[#94A3B8]/20 to-transparent', 4),
  C('carwash', 'Car Washing', <Droplet size={18} />, 'Daily bhaiya wash', 'Nifty 50', 5, 'Rain is free.', 'from-[#38BDF8]/20 to-transparent', 4),
  C('tolls', 'FASTag Tolls', <Navigation size={18} />, 'Highway tolls', 'Index Funds', 5, 'Paying to sit in slightly faster traffic.', 'from-[#A855F7]/20 to-transparent', 4),
  C('scooter', 'Rapido/Yulu', <Bike size={18} />, 'Bike taxis', 'Reliance', 5, 'Walking was free.', 'from-[#22C55E]/20 to-transparent', 4),
  C('gas', 'Petrol/Diesel', <Fuel size={18} />, 'Daily fuel', 'Gold', 5, 'Your Activa didn\'t need that.', 'from-[#EF4444]/20 to-transparent', 4),
  C('shipping', 'Delivery Fees', <Truck size={18} />, 'Blinkit fees', 'Amazon', 5, 'Patience is literally a virtue.', 'from-[#F59E0B]/20 to-transparent', 4),

  // SLIDE 5: Shopping & Lifestyle (41-50)
  C('onlineshopping', 'Online Shopping', <ShoppingCart size={18} />, 'Meesho/Myntra/Ajio', 'Bitcoin', 8, 'Those random sales cost you a house.', 'from-[#EC4899]/20 to-transparent', 5),
  C('shoes', 'Sneakers', <Watch size={18} />, 'Puma/Nike drops', 'Nifty 50', 8, 'Walking on missed investments.', 'from-[#3B82F6]/20 to-transparent', 5),
  C('makeup', 'Nykaa Hauls', <Sparkles size={18} />, 'Skincare', 'Reliance', 8, 'Glowing skin, crying bank account.', 'from-[#F472B6]/20 to-transparent', 5),
  C('gadgets', 'Croma/Reliance', <Laptop size={18} />, 'Newest iPhone', 'TCS', 8, 'Upgrading for a slightly better camera.', 'from-[#10B981]/20 to-transparent', 5),
  C('games_hardware', 'Gaming Hardware', <Gamepad2 size={18} />, 'PS5/Steam sales', 'Microsoft', 8, 'A backlog of games you never played.', 'from-[#8B5CF6]/20 to-transparent', 5),
  C('entertainment', 'Cricket Match/Movies', <Ticket size={18} />, 'Tickets & popcorn', 'Gold', 8, 'The convenience fee was higher than the ticket.', 'from-[#EF4444]/20 to-transparent', 5),
  C('salon', 'Urban Company', <Scissors size={18} />, 'Salon at home', 'Index Funds', 8, 'Expensive grooming on a broke budget.', 'from-[#A855F7]/20 to-transparent', 5),
  C('pet', 'Pet Supplies', <Dog size={18} />, 'Heads Up For Tails', 'Nifty 50', 8, 'Your indie eats better than you do.', 'from-[#FCD34D]/20 to-transparent', 5),
  C('decor', 'Home Center/IKEA', <Home size={18} />, 'Decor runs', 'Real Estate', 8, 'Throw pillows won\'t fix your life.', 'from-[#14B8A6]/20 to-transparent', 5),
  C('gifts', 'Gifts', <Package size={18} />, 'Birthdays & weddings', 'S&P 500', 8, 'Your generosity made you broke.', 'from-[#F59E0B]/20 to-transparent', 5),
];

const SLIDE_NAMES = [
  "Daily Habits & Caffeine",
  "Food & Dining Out",
  "Subscriptions & Digital",
  "Transport & Convenience",
  "Shopping & Lifestyle"
];

const DEFAULT_ASSET_RETURNS: Record<string, number> = {
  'Bitcoin': 50,
  'Ethereum': 45,
  'NVIDIA Stock': 35,
  'Apple Stock': 20,
  'Microsoft': 22,
  'Tesla': 45,
  'Amazon': 20,
  'Alphabet (Google)': 18,
  'Meta': 24,
  'Netflix': 28,
  'Reliance': 14,
  'TCS': 15,
  'HDFC Bank': 14,
  'Infosys': 14,
  'SBI': 12,
  'ITC': 10,
  'Bajaj Finance': 25,
  'S&P 500 (SPY)': 10,
  'Nifty 50': 12,
  'Mid-Cap Index': 15,
  'Physical Gold': 8,
  'Physical Silver': 9,
  'Real Estate (Tier 1)': 14,
  'Sovereign Gold Bonds (SGB)': 8.5,
  'Public Provident Fund (PPF)': 7.1,
  'Fixed Deposit (FD)': 6.5,
};

function calculateFutureValue(monthlyContribution: number, annualRatePct: number, years: number) {
  if (monthlyContribution <= 0 || years <= 0) return 0;
  const r = annualRatePct / 100;
  const n = 12;
  const t = years;
  if (r === 0) return monthlyContribution * 12 * years;
  return monthlyContribution * ((Math.pow(1 + r/n, n * t) - 1) / (r/n));
}

export default function SpendingPersonalityUI() {
  const { currency, exchangeRate } = useCurrency();
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 5;

  const [expenses, setExpenses] = useState<Record<string, { amount: string, freq: Frequency, duration: string }>>(
    CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.id]: { amount: '', freq: 'monthly', duration: cat.defaultYears.toString() } }), {})
  );

  const [assetReturns, setAssetReturns] = useState<Record<string, number>>(DEFAULT_ASSET_RETURNS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [totalMissed, setTotalMissed] = useState(0);
  const [highestCategory, setHighestCategory] = useState<CategoryConfig | null>(null);

  const handleInputChange = (id: string, amount: string) => {
    if (/^\d*\.?\d*$/.test(amount)) {
      setExpenses(prev => ({ ...prev, [id]: { ...prev[id], amount } }));
    }
  };

  const handleFreqChange = (id: string, freq: Frequency) => {
    setExpenses(prev => ({ ...prev, [id]: { ...prev[id], freq } }));
  };

  const handleDurationChange = (id: string, duration: string) => {
    if (/^\d*\.?\d*$/.test(duration)) {
      setExpenses(prev => ({ ...prev, [id]: { ...prev[id], duration } }));
    }
  };

  const handleReturnChange = (asset: string, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setAssetReturns(prev => ({ ...prev, [asset]: parseFloat(value) || 0 }));
    }
  };

  // Calculate totals dynamically
  useEffect(() => {
    let total = 0;
    let maxMissed = 0;
    let maxCat: CategoryConfig | null = null;

    CATEGORIES.forEach(cat => {
      const exp = expenses[cat.id];
      if (exp.amount && parseFloat(exp.amount) > 0 && exp.duration && parseFloat(exp.duration) > 0) {
        const amt = parseFloat(exp.amount);
        const years = parseFloat(exp.duration);
        
        let monthly = amt;
        if (exp.freq === '3_months') monthly = amt / 3;
        if (exp.freq === '6_months') monthly = amt / 6;
        if (exp.freq === 'yearly') monthly = amt / 12;
        
        const returnPct = assetReturns[cat.investment] || 0;
        const missedWealth = calculateFutureValue(monthly, returnPct, years);
        
        total += missedWealth;
        
        if (missedWealth > maxMissed) {
          maxMissed = missedWealth;
          maxCat = cat;
        }
      }
    });

    setTotalMissed(total);
    setHighestCategory(maxCat);
  }, [expenses, assetReturns]);

  // Display value dynamically scaling up
  const [displayTotal, setDisplayTotal] = useState(0);
  useEffect(() => {
    if (totalMissed === displayTotal) return;
    
    const duration = 800;
    const steps = 20;
    const stepTime = duration / steps;
    const diff = totalMissed - displayTotal;
    const increment = diff / steps;
    
    let current = displayTotal;
    let stepCount = 0;
    
    const timer = setInterval(() => {
      stepCount++;
      current += increment;
      if (stepCount >= steps) {
        setDisplayTotal(totalMissed);
        clearInterval(timer);
      } else {
        setDisplayTotal(current);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [totalMissed, displayTotal]);

  const hasActiveInputs = Object.values(expenses).some(e => e.amount !== '' && parseFloat(e.amount) > 0 && e.duration !== '' && parseFloat(e.duration) > 0);
  const currentCategories = CATEGORIES.filter(c => c.slide === currentSlide);

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden font-sans pb-32">
      <div className="bg-mesh" />

      {/* NAVBAR */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-[1400px] mx-auto border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] flex items-center justify-center font-bold text-white">W</div>
          <span className="font-bold text-xl tracking-tight text-white hidden md:block">WouldIBeRich</span>
        </Link>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="glass-panel px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 text-white hover:bg-white/10 transition-colors"
          >
            <Settings size={14} /> Returns
          </button>
                    <Link href="/">
            <button className="glass-panel px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 text-white hover:bg-white/10 transition-colors">
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

      <main className="relative z-10 px-4 md:px-6 pt-8 md:pt-12 max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 w-fit backdrop-blur-md mb-4">
            <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" />
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Ultimate Spending Quiz</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Where did your money <span className="text-gradient">really go?</span>
          </h1>
        </motion.div>

        {/* PAGINATION HEADER */}
        <div className="flex items-center justify-between max-w-4xl mx-auto mb-6 glass-panel p-2 rounded-2xl">
          <button 
            onClick={() => setCurrentSlide(prev => Math.max(1, prev - 1))}
            disabled={currentSlide === 1}
            className="p-2 text-white disabled:opacity-30 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex flex-col items-center">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
              Part {currentSlide} of {totalSlides}
            </div>
            <div className="text-sm font-bold text-white">
              {SLIDE_NAMES[currentSlide - 1]}
            </div>
          </div>

          <button 
            onClick={() => setCurrentSlide(prev => Math.min(totalSlides, prev + 1))}
            disabled={currentSlide === totalSlides}
            className="p-2 text-white disabled:opacity-30 hover:bg-white/10 rounded-xl transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8 max-w-[1400px] mx-auto">
          
          {/* LEFT SIDE: INPUTS */}
          <div className="xl:col-span-6 flex flex-col gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`inputs-${currentSlide}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-2"
              >
                {currentCategories.map((cat) => (
                  <div 
                    key={cat.id}
                    className="glass-panel p-3 rounded-xl relative overflow-hidden group focus-within:border-white/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${cat.cardColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <div className="relative z-10 flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        {cat.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-xs truncate">{cat.name}</h3>
                        <p className="text-[10px] text-gray-400 truncate">{cat.subtitle}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0 relative z-10">
                      <div className="flex items-center bg-white/5 rounded-md border border-white/10 px-2 py-1 w-[80px]">
                        <span className="text-gray-400 text-xs mr-1">{currency === 'USD' ? '$' : '₹'}</span>
                        <input 
                          type="text" 
                          value={expenses[cat.id].amount}
                          onChange={(e) => handleInputChange(cat.id, e.target.value)}
                          placeholder="0"
                          className="bg-transparent border-none outline-none text-white font-bold text-xs w-full text-right"
                        />
                      </div>
                      <select
                        value={expenses[cat.id].freq}
                        onChange={(e) => handleFreqChange(cat.id, e.target.value as Frequency)}
                        className="bg-white/5 border border-white/10 text-gray-300 text-[10px] rounded-md px-1 py-1.5 outline-none cursor-pointer"
                      >
                        <option value="monthly">Monthly</option>
                        <option value="3_months">3 Months Once</option>
                        <option value="6_months">6 Months Once</option>
                        <option value="yearly">Yearly</option>
                      </select>
                      <div className="flex items-center bg-white/5 rounded-md border border-white/10 px-2 py-1 w-[60px] ml-1">
                        <input 
                          type="text" 
                          value={expenses[cat.id].duration}
                          onChange={(e) => handleDurationChange(cat.id, e.target.value)}
                          placeholder="Yrs"
                          className="bg-transparent border-none outline-none text-white font-bold text-[10px] w-full text-right"
                        />
                        <span className="text-gray-400 text-[9px] ml-1">Yrs</span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT SIDE: LIVE OUTPUTS */}
          <div className="xl:col-span-6 flex flex-col gap-3 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`outputs-${currentSlide}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-2"
              >
                {!currentCategories.some(cat => parseFloat(expenses[cat.id].amount) > 0) && (
                  <div className="flex items-center justify-center h-full min-h-[400px] border border-dashed border-white/10 rounded-2xl">
                    <p className="text-gray-500 text-sm font-medium italic">Enter amounts and years on the left to see the damage...</p>
                  </div>
                )}

                {currentCategories.map((cat) => {
                  const exp = expenses[cat.id];
                  const amt = parseFloat(exp.amount);
                  const durationYears = parseFloat(exp.duration);
                  
                  if (isNaN(amt) || amt <= 0 || isNaN(durationYears) || durationYears <= 0) return null;

                  let monthly = amt;
                  if (exp.freq === '3_months') monthly = amt / 3;
                  if (exp.freq === '6_months') monthly = amt / 6;
                  if (exp.freq === 'yearly') monthly = amt / 12;

                  const returnPct = assetReturns[cat.investment] || 0;
                  const investedValue = calculateFutureValue(monthly, returnPct, durationYears);

                  return (
                    <motion.div
                      key={`result-${cat.id}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      layout
                      className="glass-panel p-3 px-4 rounded-xl border border-white/10 relative overflow-hidden"
                    >
                      <div className={`absolute -right-10 -top-10 w-20 h-20 bg-gradient-to-br ${cat.cardColor} rounded-full blur-[30px] opacity-40`} />
                      
                      <div className="relative z-10 flex flex-row items-center justify-between gap-4">
                        
                        {/* Real You */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-white/70">{cat.icon}</span>
                            <span className="font-bold text-white text-xs truncate">{cat.name}</span>
                          </div>
                          <div className="text-[10px] text-gray-400">Spent: <span className="text-white font-semibold">{formatCurrency(monthly, false, currency)}/mo</span></div>
                          <div className="text-[9px] text-gray-500 italic mt-0.5">Over {durationYears} years</div>
                        </div>

                        {/* Arrow */}
                        <div className="hidden sm:block text-gray-600 shrink-0">
                          <ArrowRight size={14} />
                        </div>

                        {/* Alternate You */}
                        <div className="flex-1 text-right min-w-0">
                          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">If invested in {cat.investment}:</div>
                          <div className="text-sm font-black text-[#00F5A0] truncate">
                            {formatCurrency(investedValue, false, currency)}
                          </div>
                          <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#00F5A0]/10 text-[#00F5A0] text-[9px] font-bold mt-0.5">
                            <TrendingUp size={10} /> +{returnPct.toLocaleString()}%
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10 mt-2 pt-2 border-t border-white/5">
                        <p className="text-gray-300 italic text-[10px]">&quot;{cat.roast}&quot;</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM TOTAL & ROAST */}
        <AnimatePresence>
          {hasActiveInputs && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="mt-12 max-w-4xl mx-auto"
            >
              <div className="glass-panel p-6 md:p-8 rounded-[30px] text-center relative overflow-hidden border border-[#EC4899]/30 shadow-[0_0_50px_rgba(236,72,153,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6]/10 to-[#EC4899]/10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-[#EC4899] to-transparent" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="text-center md:text-left">
                    <h2 className="text-sm md:text-base font-bold text-white mb-1 uppercase tracking-widest">Global Missed Wealth</h2>
                    <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00F5A0] via-[#3B82F6] to-[#8B5CF6] drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 20px rgba(0, 245, 160, 0.4))' }}>
                      {formatCurrency(displayTotal, false, currency)}
                    </div>
                  </div>

                  <div className="bg-[#070B1A]/80 backdrop-blur-md px-5 py-4 rounded-xl border border-white/10 text-left max-w-sm w-full">
                    <h3 className="text-[#EC4899] font-bold text-[10px] uppercase tracking-widest mb-1">🔥 Top Offender: {highestCategory?.name}</h3>
                    <p className="text-sm text-white font-medium italic">
                      {highestCategory ? highestCategory.roast : "You're actually doing okay. Stop showing off."}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      <DisclaimerWarning />
      
      {/* Global CSS for scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
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
