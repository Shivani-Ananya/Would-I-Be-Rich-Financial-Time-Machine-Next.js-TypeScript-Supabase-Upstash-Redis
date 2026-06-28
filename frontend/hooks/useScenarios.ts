import { useQuery } from '@tanstack/react-query';
import { ScenarioCategory } from '@/types/scenario.types';
import { ScenarioService } from '@/lib/api';

/**
 * useScenarios — fetches the scenario list, optionally filtered by category.
 * Wraps ScenarioService.getScenarios with React Query.
 * Client-side cache: 5 minutes staleTime.
 */
export function useScenarios(category?: ScenarioCategory | 'all') {
  const categoryParam = category === 'all' ? undefined : category;

  return useQuery({
    queryKey: ['scenarios', categoryParam ?? 'all'],
    queryFn: () => ScenarioService.getScenarios(categoryParam),
    staleTime: 5 * 60 * 1000,
    select: (res) => res.data ?? [],
  });
}

/**
 * useCategories — fetches category metadata from the service.
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => ScenarioService.getCategories(),
    staleTime: 60 * 60 * 1000, // categories rarely change
    select: (res) => res.data ?? [],
  });
}
