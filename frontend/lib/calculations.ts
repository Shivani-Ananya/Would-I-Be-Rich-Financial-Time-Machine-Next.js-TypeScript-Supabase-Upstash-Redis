// ─── Interfaces ──────────────────────────────────────────────────────────────

export type InvestmentFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface HistoricalPricePoint {
  date: string; // YYYY-MM-DD
  price: number;
}

export interface YearlyDataPoint {
  year: number;
  totalInvested: number;
  currentValue: number;
  unitsHeld: number;
}

export interface SimulationResult {
  totalInvested: number;
  unitsPurchased: number;
  currentValue: number;
  profitLoss: number;
  percentageReturn: number;
  yearlyData: YearlyDataPoint[];
}

// ─── Calculation Functions ────────────────────────────────────────────────────

/**
 * Calculates profit/loss as currentValue - totalInvested.
 */
export function calculateProfitLoss(currentValue: number, totalInvested: number): number {
  return currentValue - totalInvested;
}

/**
 * Calculates percentage return as (profitLoss / totalInvested) * 100.
 */
export function calculatePercentageReturn(profitLoss: number, totalInvested: number): number {
  if (totalInvested <= 0) return 0;
  return parseFloat(((profitLoss / totalInvested) * 100).toFixed(2));
}

/**
 * Calculates compound growth for fixed interest assets (FD, PPF, Bonds).
 * Assumes monthly compounding as standard unless specified.
 */
export function calculateCompoundGrowth(
  principal: number,
  annualRate: number,
  years: number,
  compoundingPeriodsPerYear = 12
): number {
  if (principal < 0 || annualRate < 0 || years < 0) return 0;
  return principal * Math.pow(1 + annualRate / compoundingPeriodsPerYear, compoundingPeriodsPerYear * years);
}

/**
 * Adjusts a value for average annual inflation.
 */
export function calculateInflationAdjustedValue(
  futureValue: number,
  years: number,
  averageInflationRate = 0.06 // 6% default inflation (common for INR)
): number {
  if (futureValue <= 0 || years <= 0) return futureValue;
  return futureValue / Math.pow(1 + averageInflationRate, years);
}

/**
 * Simulates a single Lump Sum investment using actual historical prices
 * or falling back to a fixed compounding growth rate if no price data is present.
 */
export function calculateLumpSumInvestment(
  amount: number,
  startDate: string,
  currentDate: string,
  historicalPriceData: HistoricalPricePoint[],
  currentPrice: number,
  fallbackAnnualRate = 0.08
): SimulationResult {
  if (amount <= 0) {
    return { totalInvested: 0, unitsPurchased: 0, currentValue: 0, profitLoss: 0, percentageReturn: 0, yearlyData: [] };
  }

  const startMs = Date.parse(startDate);
  const currentMs = Date.parse(currentDate);
  const startYear = new Date(startMs).getFullYear();
  const currentYear = new Date(currentMs).getFullYear();
  const sortedData = [...historicalPriceData].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  // Determine if we should use historical price data or compound interest math
  const hasPriceData = sortedData.length > 0 && currentPrice > 0;

  if (hasPriceData) {
    // Find initial purchase price
    const initialPoint = sortedData.find((p) => Date.parse(p.date) >= startMs) || sortedData[0];
    const purchasePrice = initialPoint.price;
    const unitsPurchased = amount / purchasePrice;
    const currentValue = unitsPurchased * currentPrice;
    
    // Generate yearly snapshots
    const yearlyData: YearlyDataPoint[] = [];
    for (let year = startYear; year <= currentYear; year++) {
      // Find the last available price point in this year
      const yearPoints = sortedData.filter((p) => new Date(p.date).getFullYear() === year);
      const yearPrice = yearPoints.length > 0 ? yearPoints[yearPoints.length - 1].price : purchasePrice;
      
      yearlyData.push({
        year,
        totalInvested: amount,
        currentValue: Math.round(unitsPurchased * yearPrice),
        unitsHeld: parseFloat(unitsPurchased.toFixed(6)),
      });
    }

    const profitLoss = calculateProfitLoss(currentValue, amount);
    const percentageReturn = calculatePercentageReturn(profitLoss, amount);

    return {
      totalInvested: amount,
      unitsPurchased: parseFloat(unitsPurchased.toFixed(6)),
      currentValue: Math.round(currentValue),
      profitLoss: Math.round(profitLoss),
      percentageReturn,
      yearlyData,
    };
  } else {
    // Fallback: Compound interest math
    const totalInvested = amount;
    const yearlyData: YearlyDataPoint[] = [];
    
    for (let year = startYear; year <= currentYear; year++) {
      const elapsedYears = year - startYear;
      const val = calculateCompoundGrowth(amount, fallbackAnnualRate, elapsedYears);
      yearlyData.push({
        year,
        totalInvested,
        currentValue: Math.round(val),
        unitsHeld: 1, // Fixed-income is unitary
      });
    }

    const currentValue = yearlyData[yearlyData.length - 1]?.currentValue || amount;
    const profitLoss = calculateProfitLoss(currentValue, totalInvested);
    const percentageReturn = calculatePercentageReturn(profitLoss, totalInvested);

    return {
      totalInvested,
      unitsPurchased: 1,
      currentValue,
      profitLoss,
      percentageReturn,
      yearlyData,
    };
  }
}

/**
 * Simulates a recurring Systematic Investment Plan (DCA) using historical price points.
 * Automatically aligns investments to specified frequencies.
 */
export function calculateRecurringInvestment(
  amount: number,
  frequency: InvestmentFrequency,
  startDate: string,
  currentDate: string,
  historicalPriceData: HistoricalPricePoint[],
  currentPrice: number,
  fallbackAnnualRate = 0.08
): SimulationResult {
  if (amount <= 0) {
    return { totalInvested: 0, unitsPurchased: 0, currentValue: 0, profitLoss: 0, percentageReturn: 0, yearlyData: [] };
  }

  const startMs = Date.parse(startDate);
  const currentMs = Date.parse(currentDate);
  const startYear = new Date(startMs).getFullYear();
  const currentYear = new Date(currentMs).getFullYear();
  const sortedData = [...historicalPriceData].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

  const hasPriceData = sortedData.length > 0 && currentPrice > 0;

  if (hasPriceData) {
    let totalInvested = 0;
    let unitsPurchased = 0;
    const yearlyData: YearlyDataPoint[] = [];
    
    // Map dates to their prices for efficient lookups
    const dataByDate = new Map<string, number>();
    sortedData.forEach((p) => dataByDate.set(p.date, p.price));

    // Determine interval step in milliseconds
    let stepMs = 30 * 24 * 60 * 60 * 1000; // default monthly
    if (frequency === 'daily') stepMs = 24 * 60 * 60 * 1000;
    else if (frequency === 'weekly') stepMs = 7 * 24 * 60 * 60 * 1000;
    else if (frequency === 'yearly') stepMs = 365 * 24 * 60 * 60 * 1000;

    let currentInvestMs = startMs;
    let lastPrice = currentPrice;

    // Simulate investments period by period
    while (currentInvestMs <= currentMs) {
      const investDateStr = new Date(currentInvestMs).toISOString().split('T')[0];
      
      // Find exact match or find the closest date in historical data
      let purchasePrice = dataByDate.get(investDateStr);
      if (!purchasePrice) {
        const closestPoint = sortedData.find((p) => Date.parse(p.date) >= currentInvestMs);
        purchasePrice = closestPoint ? closestPoint.price : lastPrice;
      }

      if (purchasePrice > 0) {
        totalInvested += amount;
        unitsPurchased += amount / purchasePrice;
        lastPrice = purchasePrice;
      }

      currentInvestMs += stepMs;
    }

    // Generate yearly snapshots
    for (let year = startYear; year <= currentYear; year++) {
      // Find historical price at the end of the year
      const yearPoints = sortedData.filter((p) => new Date(p.date).getFullYear() === year);
      const yearEndPrice = yearPoints.length > 0 ? yearPoints[yearPoints.length - 1].price : lastPrice;

      // Calculate total contributions made up to this year
      let investedUpToYear = 0;
      let checkMs = startMs;
      while (checkMs <= currentMs && new Date(checkMs).getFullYear() <= year) {
        investedUpToYear += amount;
        checkMs += stepMs;
      }

      // Calculate units accumulated up to this year
      let unitsUpToYear = 0;
      checkMs = startMs;
      while (checkMs <= currentMs && new Date(checkMs).getFullYear() <= year) {
        const checkDateStr = new Date(checkMs).toISOString().split('T')[0];
        let pPrice = dataByDate.get(checkDateStr);
        if (!pPrice) {
          const closest = sortedData.find((p) => Date.parse(p.date) >= checkMs);
          pPrice = closest ? closest.price : lastPrice;
        }
        if (pPrice > 0) {
          unitsUpToYear += amount / pPrice;
        }
        checkMs += stepMs;
      }

      yearlyData.push({
        year,
        totalInvested: Math.round(investedUpToYear),
        currentValue: Math.round(unitsUpToYear * yearEndPrice),
        unitsHeld: parseFloat(unitsUpToYear.toFixed(6)),
      });
    }

    const currentValue = unitsPurchased * currentPrice;
    const profitLoss = calculateProfitLoss(currentValue, totalInvested);
    const percentageReturn = calculatePercentageReturn(profitLoss, totalInvested);

    return {
      totalInvested: Math.round(totalInvested),
      unitsPurchased: parseFloat(unitsPurchased.toFixed(6)),
      currentValue: Math.round(currentValue),
      profitLoss: Math.round(profitLoss),
      percentageReturn,
      yearlyData,
    };
  } else {
    // Fallback: Compound interest math for recurring investments
    let totalInvested = 0;
    const yearlyData: YearlyDataPoint[] = [];

    // Calculate periodic compounding deposits
    let depositsPerYear = 12;
    if (frequency === 'daily') depositsPerYear = 365;
    else if (frequency === 'weekly') depositsPerYear = 52;
    else if (frequency === 'yearly') depositsPerYear = 1;

    const periodicRate = fallbackAnnualRate / depositsPerYear;

    for (let year = startYear; year <= currentYear; year++) {
      const elapsedYears = year - startYear + 1;
      const totalPeriods = elapsedYears * depositsPerYear;
      
      const invested = amount * totalPeriods;
      // Future value of annuity formula: PMT * [((1 + r)^n - 1) / r]
      const val = periodicRate > 0 
        ? amount * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate)
        : invested;

      yearlyData.push({
        year,
        totalInvested: Math.round(invested),
        currentValue: Math.round(val),
        unitsHeld: 1,
      });
    }

    const finalPoint = yearlyData[yearlyData.length - 1];
    totalInvested = finalPoint?.totalInvested || 0;
    const currentValue = finalPoint?.currentValue || 0;
    const profitLoss = calculateProfitLoss(currentValue, totalInvested);
    const percentageReturn = calculatePercentageReturn(profitLoss, totalInvested);

    return {
      totalInvested,
      unitsPurchased: 1,
      currentValue,
      profitLoss,
      percentageReturn,
      yearlyData,
    };
  }
}
