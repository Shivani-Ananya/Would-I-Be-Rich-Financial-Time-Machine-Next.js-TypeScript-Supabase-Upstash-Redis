export type ScenarioCategory = 
  | 'crypto' 
  | 'spending' 
  | 'real_estate' 
  | 'stocks' 
  | 'life' 
  | 'debt' 
  | 'macro';

export type SimulationType = 
  | 'lump_sum' 
  | 'recurring_dca' 
  | 'real_estate' 
  | 'inflation';

export interface ScenarioParams {
  asset?: string;
  initial_amount?: number;
  start_date?: string;
  end_date?: string;
  monthly_amount?: number;
  investment_asset?: string;
  frequency?: string;
  city?: string;
  purchase_price?: number;
  down_pct?: number;
  appreciation_pct?: number;
  mortgage_rate?: number;
}

export interface Scenario {
  id: number;
  uuid: string;
  title: string;
  description: string;
  category: ScenarioCategory;
  sim_type: SimulationType;
  params: ScenarioParams;
  run_count: number;
  is_active: boolean;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface SimulationResultData {
  result_id: string;
  scenario: {
    uuid: string;
    title: string;
    category: ScenarioCategory;
  };
  alternate_you: {
    value: number;
    label: string;
    description: string;
  };
  real_you: {
    value: number;
    label: string;
    description: string;
  };
  difference: number;
  growth_pct: number;
  is_positive: boolean;
  chart_data: ChartDataPoint[];
  commentary: string;
  cached: boolean;
  duration_ms: number;
  computed_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details: any;
  } | null;
}
