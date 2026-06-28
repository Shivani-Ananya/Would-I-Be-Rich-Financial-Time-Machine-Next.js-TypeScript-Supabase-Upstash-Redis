/**
 * Format a number as a USD currency string.
 * e.g. 287450 → "$287,450.00"
 */
export type CurrencyType = 'USD' | 'INR';

export function formatCurrency(value: number, compact = false, currency: CurrencyType = 'INR', rate: number = 1): string {
  const converted = value * rate;

  if (Math.abs(converted) >= 10000000) {
    const inCr = converted / 10000000;
    return `₹${inCr.toFixed(2)} Cr`;
  } else if (Math.abs(converted) >= 100000) {
    const inLakhs = converted / 100000;
    return `₹${inLakhs.toFixed(2)} Lakhs`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(converted);
}

/**
 * Format a growth percentage.
 * e.g. 57390 → "+57,390%"
 */
export function formatGrowth(pct: number): string {
  const sign = pct > 0 ? '+' : '';
  return `${sign}${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(pct)}%`;
}

/**
 * Format a run count for display.
 * e.g. 54320 → "54.3K runs"
 */
export function formatRunCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M runs`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K runs`;
  return `${count} runs`;
}
