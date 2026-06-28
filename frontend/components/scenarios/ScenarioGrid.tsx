'use client';

import { Scenario } from '@/types/scenario.types';
import ScenarioCard from './ScenarioCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';

interface ScenarioGridProps {
  scenarios: Scenario[];
  isLoading?: boolean;
  onSelectScenario: (uuid: string) => void;
}

function ScenarioCardSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-card border border-border">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-5 w-3/4 rounded" />
      <Skeleton className="h-4 w-full rounded" />
      <Skeleton className="h-4 w-2/3 rounded" />
      <div className="flex justify-between pt-2 border-t border-border">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export default function ScenarioGrid({ scenarios, isLoading = false, onSelectScenario }: ScenarioGridProps) {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-busy="true"
        aria-label="Loading scenarios"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <ScenarioCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <span className="text-6xl mb-4" role="img" aria-label="empty">🔍</span>
        <h3 className="text-xl font-black text-foreground mb-2 uppercase tracking-tight">No scenarios found</h3>
        <p className="text-foreground/40 text-sm font-medium italic">
          Try a different category or check back later.
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      aria-label="Scenario list"
    >
      {scenarios.map((scenario) => (
        <motion.div key={scenario.uuid} variants={itemVariants}>
          <ScenarioCard
            scenario={scenario}
            onSelect={onSelectScenario}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
