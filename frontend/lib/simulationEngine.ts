import { ScenarioCategory, InvestmentType } from './supabase';

export interface SimulationParams {
  scenarioId: string;
  investmentType: InvestmentType;
  amount: number;
  frequency: 'daily' | 'monthly' | 'yearly';
  startDate: string;
  currency: 'USD' | 'INR';
}

export interface ChartDataPoint {
  year: number;
  totalInvested: number;
  currentValue: number;
}

export interface SimulationResult {
  totalInvested: number;
  currentValue: number;
  profitLoss: number;
  percentageReturn: number;
  chartData: ChartDataPoint[];
}

// ─── Historical Asset Performance Mapping ────────────────────────────────────
// Annual returns and historical patterns for key categories
const ASSET_PERFORMANCE: Record<
  ScenarioCategory,
  { annualReturn: number; volatility: number; baseGrowthFactor: number }
> = {
  crypto: { annualReturn: 0.45, volatility: 0.8, baseGrowthFactor: 15.0 }, // High volatility, high return
  spending: { annualReturn: 0.10, volatility: 0.15, baseGrowthFactor: 1.1 }, // Standard S&P 500
  stocks: { annualReturn: 0.12, volatility: 0.18, baseGrowthFactor: 1.15 }, // Nifty 50
  macro: { annualReturn: 0.08, volatility: 0.12, baseGrowthFactor: 1.08 }, // Gold / Macro
  real_estate: { annualReturn: 0.07, volatility: 0.08, baseGrowthFactor: 1.07 }, // Bangalore property
  life: { annualReturn: 0.06, volatility: 0.1, baseGrowthFactor: 1.06 },
  debt: { annualReturn: -0.12, volatility: 0.05, baseGrowthFactor: 0.88 }, // Negative drag
};

/**
 * Calculates compound interest with yearly snapshots.
 * Simulates historical DCA or Lump Sum growth using category-specific metrics.
 */
export function runSimulation(
  category: ScenarioCategory,
  params: SimulationParams
): SimulationResult {
  const { investmentType, amount, frequency, startDate } = params;
  
  const startYear = new Date(startDate).getFullYear();
  const currentYear = 2026;
  const yearsTotal = Math.max(1, currentYear - startYear);
  
  const performance = ASSET_PERFORMANCE[category] || ASSET_PERFORMANCE.stocks;
  const r = performance.annualReturn;
  
  let totalInvested = 0;
  let currentValue = 0;
  const chartData: ChartDataPoint[] = [];

  // Initialize values for year-by-year compounding
  if (investmentType === 'lump_sum') {
    totalInvested = amount;
    currentValue = amount;
    
    // Add start year initial state
    chartData.push({
      year: startYear,
      totalInvested,
      currentValue: Math.round(currentValue),
    });

    for (let year = startYear + 1; year <= currentYear; year++) {
      // Apply annual returns with deterministic variance to feel "real"
      const variance = (Math.sin(year) * performance.volatility * 0.5);
      const yearReturn = r + variance;
      currentValue = currentValue * (1 + yearReturn);
      
      chartData.push({
        year,
        totalInvested,
        currentValue: Math.round(Math.max(0, currentValue)),
      });
    }
  } else {
    // DCA (recurring_dca, real_estate, etc.)
    // Calculate deposits per year based on frequency
    let depositsPerYear = 12; // default monthly
    if (frequency === 'daily') depositsPerYear = 365;
    else if (frequency === 'yearly') depositsPerYear = 1;

    const periodicAmount = amount;
    const periodicRate = r / depositsPerYear;

    // Track state month-by-month or step-by-step
    let cumulativeInvested = 0;
    let cumulativeValue = 0;

    // Start Year (year 0)
    cumulativeInvested += periodicAmount * depositsPerYear;
    cumulativeValue = periodicAmount * ((Math.pow(1 + periodicRate, depositsPerYear) - 1) / periodicRate);
    
    chartData.push({
      year: startYear,
      totalInvested: Math.round(cumulativeInvested),
      currentValue: Math.round(cumulativeValue),
    });

    for (let year = startYear + 1; year <= currentYear; year++) {
      // Annual return volatility factor for the year
      const variance = (Math.sin(year) * performance.volatility * 0.5);
      const adjustedRate = (r + variance) / depositsPerYear;

      // Compound existing value for the year
      cumulativeValue = cumulativeValue * Math.pow(1 + (r + variance), 1);

      // Add new periodic contributions during the year
      for (let step = 0; step < depositsPerYear; step++) {
        cumulativeInvested += periodicAmount;
        cumulativeValue += periodicAmount * Math.pow(1 + adjustedRate, depositsPerYear - step);
      }

      chartData.push({
        year,
        totalInvested: Math.round(cumulativeInvested),
        currentValue: Math.round(Math.max(0, cumulativeValue)),
      });
    }

    totalInvested = cumulativeInvested;
    currentValue = cumulativeValue;
  }

  const profitLoss = currentValue - totalInvested;
  const percentageReturn = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

  return {
    totalInvested: Math.round(totalInvested),
    currentValue: Math.round(currentValue),
    profitLoss: Math.round(profitLoss),
    percentageReturn: parseFloat(percentageReturn.toFixed(2)),
    chartData,
  };
}
