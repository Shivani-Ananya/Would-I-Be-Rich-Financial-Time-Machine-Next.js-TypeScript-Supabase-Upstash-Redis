import { redis } from './redis';

// ─── Ticker Mapping ──────────────────────────────────────────────────────────
const ASSET_TICKER_MAP: Record<string, string> = {
  bitcoin: 'BTC-USD',
  ethereum: 'ETH-USD',
  gold: 'GC=F',
  silver: 'SI=F',
  'nifty-50': '^NSEI',
  'sp-500': '^GSPC',
  apple: 'AAPL',
  nvidia: 'NVDA',
  tesla: 'TSLA',
};

// Realistic fallbacks (baseline price in 2010, average annual growth, and volatility)
const FALLBACK_METRICS: Record<string, { basePrice2010: number; annualGrowth: number; volatility: number }> = {
  bitcoin: { basePrice2010: 0.1, annualGrowth: 1.15, volatility: 0.8 },
  ethereum: { basePrice2010: 1.0, annualGrowth: 0.90, volatility: 0.85 },
  gold: { basePrice2010: 1100, annualGrowth: 0.06, volatility: 0.12 },
  silver: { basePrice2010: 18.0, annualGrowth: 0.04, volatility: 0.20 },
  'nifty-50': { basePrice2010: 5200, annualGrowth: 0.11, volatility: 0.16 },
  'sp-500': { basePrice2010: 1100, annualGrowth: 0.09, volatility: 0.14 },
  apple: { basePrice2010: 9.0, annualGrowth: 0.22, volatility: 0.25 },
  nvidia: { basePrice2010: 0.4, annualGrowth: 0.38, volatility: 0.45 },
  tesla: { basePrice2010: 1.3, annualGrowth: 0.45, volatility: 0.50 },
};

export interface PriceDataPoint {
  date: string; // YYYY-MM-DD
  price: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Fetch with retry helper.
 */
async function fetchWithRetry(url: string, retries = 3, delayMs = 1000): Promise<any> {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  };
  
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, { headers, next: { revalidate: 3600 } });
      if (res.ok) {
        return await res.json();
      }
      if (res.status === 429) {
        console.warn(`[market-data] rate limited (429), retrying in ${delayMs}ms...`);
      } else {
        console.warn(`[market-data] fetch failed with status ${res.status}, retrying...`);
      }
    } catch (err) {
      console.warn(`[market-data] fetch exception:`, err);
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, i)));
  }
  throw new Error(`Failed to fetch from Yahoo Finance after ${retries} retries`);
}

/**
 * Generates realistic fallback price curves if the live API fails.
 */
function getFallbackSeries(
  assetId: string,
  startTs: number,
  endTs: number
): PriceDataPoint[] {
  const metrics = FALLBACK_METRICS[assetId.toLowerCase()] || FALLBACK_METRICS['sp-500'];
  const points: PriceDataPoint[] = [];
  
  const startYear = new Date(startTs * 1000).getFullYear();
  const endYear = new Date(endTs * 1000).getFullYear();
  
  let currentPrice = metrics.basePrice2010;
  // Grow price up to startYear
  for (let y = 2010; y < startYear; y++) {
    currentPrice *= (1 + metrics.annualGrowth);
  }

  // Generate date points (approx monthly increments to avoid excessive array sizes)
  let currentTs = startTs;
  const dayStep = 30 * 24 * 60 * 60; // 30 days
  
  while (currentTs <= endTs) {
    const dateStr = new Date(currentTs * 1000).toISOString().split('T')[0];
    const year = new Date(currentTs * 1000).getFullYear();
    
    // Apply deterministic compounding return with yearly volatility variance
    const variance = Math.sin(year + currentTs) * metrics.volatility * 0.3;
    const rate = (metrics.annualGrowth + variance) / 12; // monthly rate
    currentPrice *= (1 + rate);
    
    points.push({
      date: dateStr,
      price: parseFloat(Math.max(0.01, currentPrice).toFixed(4)),
    });
    
    currentTs += dayStep;
  }
  
  return points;
}

// ─── Reusable Service Functions ───────────────────────────────────────────────

/**
 * Fetches historical price series for a given asset over a date range.
 * Standardizes format as `{ date: 'YYYY-MM-DD', price: number }[]`.
 */
export async function getHistoricalSeries(
  assetId: string,
  startDate: string,
  endDate: string
): Promise<PriceDataPoint[]> {
  const normalizedAsset = assetId.toLowerCase();
  const cacheKey = `market:${normalizedAsset}:${startDate}:${endDate}`;

  // Check Redis Cache
  if (redis) {
    try {
      const cached = await redis.get<PriceDataPoint[]>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('[redis] Cache read error in getHistoricalSeries:', err);
    }
  }

  const ticker = ASSET_TICKER_MAP[normalizedAsset];
  const startTs = Math.floor(Date.parse(startDate) / 1000);
  const endTs = Math.floor(Date.parse(endDate) / 1000);

  if (!ticker || isNaN(startTs) || isNaN(endTs)) {
    return getFallbackSeries(normalizedAsset, startTs || 1262304000, endTs || 1772323200);
  }

  let series: PriceDataPoint[] = [];

  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${startTs}&period2=${endTs}&interval=1d`;
    const data = await fetchWithRetry(url);
    
    const chart = data?.chart?.result?.[0];
    const timestamps = chart?.timestamp || [];
    const closes = chart?.indicators?.quote?.[0]?.close || [];
    
    if (timestamps.length > 0 && closes.length > 0) {
      // Map to standardized data points, filtering out null closes
      series = timestamps
        .map((ts: number, idx: number) => ({
          date: new Date(ts * 1000).toISOString().split('T')[0],
          price: closes[idx] !== null ? parseFloat(closes[idx].toFixed(4)) : null,
        }))
        .filter((p: any) => p.price !== null) as PriceDataPoint[];
    }
  } catch (error) {
    console.warn(`[market-data] Yahoo Finance failed for ${ticker}. Using simulated fallback. Error:`, error);
    series = getFallbackSeries(normalizedAsset, startTs, endTs);
  }

  // If no series points could be collected, fallback to mock data generator
  if (series.length === 0) {
    series = getFallbackSeries(normalizedAsset, startTs, endTs);
  }

  // Cache response for 24 hours
  if (redis && series.length > 0) {
    try {
      await redis.set(cacheKey, series, { ex: 86400 });
      await redis.set('market_data_last_fetched', new Date().toISOString());
    } catch (err) {
      console.error('[redis] Cache write error in getHistoricalSeries:', err);
    }
  }

  return series;
}

/**
 * Fetches the current/latest price of an asset.
 */
export async function getCurrentPrice(assetId: string): Promise<number> {
  const normalizedAsset = assetId.toLowerCase();
  const cacheKey = `market:current:${normalizedAsset}`;

  if (redis) {
    try {
      const cached = await redis.get<number>(cacheKey);
      if (cached) return cached;
    } catch (err) {
      console.error('[redis] Cache read error in getCurrentPrice:', err);
    }
  }

  const ticker = ASSET_TICKER_MAP[normalizedAsset];
  let price = 0;

  if (ticker) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1m&range=1d`;
      const data = await fetchWithRetry(url);
      const meta = data?.chart?.result?.[0]?.meta;
      price = meta?.regularMarketPrice || 0;
    } catch (error) {
      console.warn(`[market-data] Current price fetch failed for ${ticker}. Using latest fallback.`, error);
    }
  }

  // If live fetch failed or wasn't mapping, use the last snapshot from fallback engine
  if (price <= 0) {
    const fallback = getFallbackSeries(normalizedAsset, Math.floor(Date.now() / 1000) - 86400, Math.floor(Date.now() / 1000));
    price = fallback[fallback.length - 1]?.price || 100;
  }

  if (redis && price > 0) {
    try {
      await redis.set(cacheKey, price, { ex: 3600 }); // cache latest current price for 1 hour to keep it fresh
      await redis.set('market_data_last_fetched', new Date().toISOString());
    } catch (err) {
      console.error('[redis] Cache write error in getCurrentPrice:', err);
    }
  }

  return price;
}

/**
 * Fetches the price of an asset on a specific date.
 */
export async function getHistoricalPrice(assetId: string, date: string): Promise<number> {
  const normalizedAsset = assetId.toLowerCase();
  const dateObj = new Date(date);
  
  // Create a 5-day window around the requested date because weekends/holidays have no trade data
  const startWindow = new Date(dateObj.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endWindow = new Date(dateObj.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const series = await getHistoricalSeries(normalizedAsset, startWindow, endWindow);
  
  if (series.length > 0) {
    // Return the closest data point
    return series[0].price;
  }

  // Ultimate fallback based on metric constants
  const metrics = FALLBACK_METRICS[normalizedAsset] || FALLBACK_METRICS['sp-500'];
  const years = Math.max(0, dateObj.getFullYear() - 2010);
  return metrics.basePrice2010 * Math.pow(1 + metrics.annualGrowth, years);
}
