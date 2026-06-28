'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function MarketStatusBadge() {
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/market-status');
      if (res.ok) {
        const data = await res.json();
        if (data.lastFetched) {
          const date = new Date(data.lastFetched);
          
          // Format date as DD MMM YYYY, HH:MM
          const day = date.getDate().toString().padStart(2, '0');
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const month = months[date.getMonth()];
          const year = date.getFullYear();
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          
          setTimestamp(`${day} ${month} ${year}, ${hours}:${minutes}`);
        }
      }
    } catch (err) {
      console.error('Failed to fetch market status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Auto-refresh every 30 seconds to fetch latest data status
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel px-3.5 py-1.5 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-2 border border-white/10 backdrop-blur-md text-gray-300 shadow-[0_0_15px_rgba(255,255,255,0.02)] select-none">
      <span className="flex h-1.5 w-1.5 items-center justify-center">
        <span className={`absolute inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 opacity-75 ${loading ? 'animate-ping' : ''}`} />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      <span>Last data fetched:</span>
      {loading && !timestamp ? (
        <span className="w-24 h-3 bg-white/10 rounded animate-pulse inline-block" />
      ) : (
        <span className="text-white font-black tracking-wide flex items-center gap-1">
          {timestamp}
          {loading && <RefreshCw size={10} className="animate-spin text-gray-400 ml-1" />}
        </span>
      )}
    </div>
  );
}
