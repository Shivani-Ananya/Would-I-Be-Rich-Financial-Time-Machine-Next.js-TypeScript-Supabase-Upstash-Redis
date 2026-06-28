import { useMutation } from '@tanstack/react-query';
import { SimulationService } from '@/lib/api';
import { SimulationResultData } from '@/types/scenario.types';

export interface CustomSimulationParams {
  sim_type: 'lump_sum';
  asset: string;
  initial_amount: number;
  start_date: string;
}

/**
 * useSimulation — triggers a pre-built scenario simulation.
 * Returns { mutate, isPending, data, error }.
 */
export function useSimulation() {
  return useMutation({
    mutationFn: (uuid: string) => SimulationService.simulateScenario(uuid),
    onError: (err) => {
      console.error('[useSimulation] failed:', err);
    },
  });
}

/**
 * useCustomSimulation — runs a custom user-defined simulation.
 * Accepts ticker, amount, and start date validated upstream by Zod.
 */
export function useCustomSimulation() {
  return useMutation<
    { success: boolean; data: SimulationResultData | null; error: unknown },
    Error,
    CustomSimulationParams
  >({
    mutationFn: async (params: CustomSimulationParams) => {
      // For now resolves through the mock service.
      // Replace with Axios POST /api/v1/simulate/custom when backend is live.
      await new Promise((r) => setTimeout(r, 1800)); // simulate latency
      return {
        success: true,
        data: {
          result_id: `res_custom_${Date.now()}`,
          scenario: {
            uuid: 'custom',
            title: `What if I bought $${params.initial_amount} of ${params.asset}?`,
            category: 'stocks' as const,
          },
          alternate_you: {
            value: params.initial_amount * 4.7,
            label: 'Alternate You',
            description: `$${params.initial_amount} in ${params.asset} since ${params.start_date}`,
          },
          real_you: {
            value: params.initial_amount,
            label: 'Real You',
            description: 'Kept the cash',
          },
          difference: params.initial_amount * 3.7,
          growth_pct: 370,
          is_positive: true,
          chart_data: [
            { date: params.start_date.slice(0, 7), value: params.initial_amount },
            { date: '2020-01', value: params.initial_amount * 1.8 },
            { date: '2023-01', value: params.initial_amount * 3.1 },
            { date: new Date().toISOString().slice(0, 7), value: params.initial_amount * 4.7 },
          ],
          commentary: `Not bad for someone who almost bought another pair of sneakers instead.`,
          cached: false,
          duration_ms: 1800,
          computed_at: new Date().toISOString(),
        },
        error: null,
      };
    },
    onError: (err) => {
      console.error('[useCustomSimulation] failed:', err);
    },
  });
}
