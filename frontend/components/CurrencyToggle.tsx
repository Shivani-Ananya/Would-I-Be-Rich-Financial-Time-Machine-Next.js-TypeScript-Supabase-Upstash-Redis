'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCurrency } from '@/lib/CurrencyContext';

export default function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10 relative">
      <button 
        onClick={() => setCurrency('USD')}
        className={`flex items-center justify-center px-4 py-2 w-[60px] h-[32px] rounded-full text-xs font-bold transition-colors duration-300 ease-in-out relative z-10 ${currency === 'USD' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
      >
        USD
      </button>
      <button 
        onClick={() => setCurrency('INR')}
        className={`flex items-center justify-center px-4 py-2 w-[60px] h-[32px] rounded-full text-xs font-bold transition-colors duration-300 ease-in-out relative z-10 ${currency === 'INR' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
      >
        INR
      </button>
      {/* Animated Pill Background */}
      <motion.div 
        layoutId="currencyPill"
        className="absolute top-1 bottom-1 w-[60px] rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] shadow-md shadow-[#EC4899]/20"
        initial={false}
        animate={{ left: currency === 'USD' ? '4px' : '64px' }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    </div>
  );
}
