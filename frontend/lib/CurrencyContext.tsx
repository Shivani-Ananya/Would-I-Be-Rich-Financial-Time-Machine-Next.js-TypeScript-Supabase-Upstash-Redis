'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CurrencyType } from '@/utils/formatCurrency';

interface CurrencyContextType {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
  exchangeRate: number; // 1 for USD, e.g. ~83.5 for INR
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyType>('INR');
  const [exchangeRate, setExchangeRate] = useState<number>(1);

  useEffect(() => {
    // Attempt to fetch from an open API. Open.er-api is a free open exchangerate API.
    fetch('https://open.er-api.com/v6/latest/USD')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates && data.rates.INR) {
          setExchangeRate(data.rates.INR);
        } else {
          // Fallback if data is malformed
          setExchangeRate(83.5);
        }
      })
      .catch((error) => {
        console.error('Failed to fetch exchange rate, using fallback.', error);
        setExchangeRate(83.5); // Fallback
      });
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
