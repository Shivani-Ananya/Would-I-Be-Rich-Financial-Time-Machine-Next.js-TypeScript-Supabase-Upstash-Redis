import { Scenario, SimulationResultData } from '../types/scenario.types';

export const mockScenarios: Scenario[] = [
  {
    id: 1,
    uuid: 'uuid-btc-2015',
    title: 'What if I bought Bitcoin in 2015?',
    description: 'See the impact of investing early in the world\'s most famous cryptocurrency.',
    category: 'crypto',
    sim_type: 'lump_sum',
    params: {
      asset: 'BTC-USD',
      initial_amount: 500,
      start_date: '2015-01-01',
      end_date: 'today'
    },
    run_count: 54320,
    is_active: true
  },
  {
    id: 2,
    uuid: 'uuid-coffee-money',
    title: 'What if I invested my daily coffee money?',
    description: 'Instead of $5 latte every day, what if you put it into the S&P 500?',
    category: 'spending',
    sim_type: 'recurring_dca',
    params: {
      monthly_amount: 150,
      investment_asset: 'SPY',
      start_date: '2010-01-01',
      frequency: 'monthly'
    },
    run_count: 82012,
    is_active: true
  },
  {
    id: 3,
    uuid: 'uuid-austin-house',
    title: 'Buying a house in Austin in 2015',
    description: 'Did you miss the Texas real estate boom?',
    category: 'real_estate',
    sim_type: 'real_estate',
    params: {
      city: 'Austin',
      purchase_price: 300000,
      down_pct: 0.20,
      appreciation_pct: 0.80,
      mortgage_rate: 0.04
    },
    run_count: 12450,
    is_active: true
  }
];

export const mockCategories = [
  { id: 'crypto', name: 'Crypto', scenarioCount: 1, icon: 'Bitcoin' },
  { id: 'spending', name: 'Spending Habits', scenarioCount: 1, icon: 'Coffee' },
  { id: 'real_estate', name: 'Real Estate', scenarioCount: 1, icon: 'Home' },
  { id: 'stocks', name: 'Stock Market', scenarioCount: 0, icon: 'TrendingUp' },
];

export const mockSimulationResult: SimulationResultData = {
  result_id: "res_7f3a2b",
  scenario: { 
    uuid: "uuid-btc-2015", 
    title: "What if I bought Bitcoin in 2015?", 
    category: "crypto" 
  },
  alternate_you: { 
    value: 287450.00, 
    label: "Alternate You", 
    description: "Bought 1 BTC at $500" 
  },
  real_you: { 
    value: 500.00, 
    label: "Real You", 
    description: "Spent it on... something else" 
  },
  difference: 286950.00, 
  growth_pct: 57390.0, 
  is_positive: true,
  chart_data: [
    { date: "2015-01", value: 500.0 }, 
    { date: "2018-01", value: 15000.0 }, 
    { date: "2021-01", value: 45000.0 }, 
    { date: "2024-01", value: 65000.0 }, 
    { date: "2026-04", value: 287450.0 }
  ],
  commentary: "You could've retired to a beach... but hey, at least you're caffeinated.",
  cached: true, 
  duration_ms: 45, 
  computed_at: new Date().toISOString()
};
