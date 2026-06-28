import { Scenario, SimulationResultData, ApiResponse } from '../types/scenario.types';
import { mockScenarios, mockCategories, mockSimulationResult } from './mockData';

// ─── API Scenario (shape returned by /api/scenarios route) ───────────────────

export type ApiScenarioCategory =
  | 'crypto'
  | 'spending'
  | 'real_estate'
  | 'stocks'
  | 'life'
  | 'debt'
  | 'macro';

export type ApiInvestmentType =
  | 'lump_sum'
  | 'recurring_dca'
  | 'real_estate'
  | 'inflation';

export interface ApiScenario {
  id: string;
  title: string;
  category: ApiScenarioCategory;
  description: string;
  icon: string;
  investmentType: ApiInvestmentType;
}

interface ApiScenariosResponse {
  success: boolean;
  data: ApiScenario[];
  error: null | { code: string; message: string };
}

/**
 * fetchScenarios — calls the /api/scenarios Next.js route and returns the
 * typed scenario array. Throws on non-OK HTTP or on API-level error.
 */
export async function fetchScenarios(): Promise<ApiScenario[]> {
  const res = await fetch('/api/scenarios');
  if (!res.ok) {
    throw new Error(`Failed to fetch scenarios: HTTP ${res.status}`);
  }
  const json: ApiScenariosResponse = await res.json();
  if (!json.success) {
    throw new Error(json.error?.message ?? 'Unknown API error');
  }
  return json.data;
}


// Delay helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ScenarioService = {
  async getScenarios(category?: string): Promise<ApiResponse<Scenario[]>> {
    await delay(600); // simulate API response time
    
    let data = mockScenarios;
    if (category) {
      data = data.filter(s => s.category === category);
    }
    
    return {
      success: true,
      data,
      error: null
    };
  },

  async getCategories(): Promise<ApiResponse<typeof mockCategories>> {
    await delay(300);
    return {
      success: true,
      data: mockCategories,
      error: null
    };
  },

  async getScenarioByUuid(uuid: string): Promise<ApiResponse<Scenario>> {
    await delay(400);
    const scenario = mockScenarios.find(s => s.uuid === uuid);
    
    if (!scenario) {
      return {
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Scenario not found', details: {} }
      };
    }
    
    return {
      success: true,
      data: scenario,
      error: null
    };
  }
};

export const SimulationService = {
  async simulateScenario(uuid: string): Promise<ApiResponse<SimulationResultData>> {
    await delay(1500); // Simulate math processing time
    
    // In strict testing mode, throw a simulated 404 for unknown uuids
    if (!mockScenarios.find(s => s.uuid === uuid)) {
      return {
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Scenario not found', details: {} }
      };
    }

    return {
      success: true,
      data: mockSimulationResult,
      error: null
    };
  },

  async getResultById(resultId: string): Promise<ApiResponse<SimulationResultData>> {
    await delay(500);
    
    if (resultId !== mockSimulationResult.result_id) {
       return {
        success: false,
        data: null,
        error: { code: 'NOT_FOUND', message: 'Result expired or missing', details: {} }
      };
    }

    return {
      success: true,
      data: mockSimulationResult,
      error: null
    };
  }
};
