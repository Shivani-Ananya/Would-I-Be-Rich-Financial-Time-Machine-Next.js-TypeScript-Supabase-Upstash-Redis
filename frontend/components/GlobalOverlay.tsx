'use client';

import { useUIStore } from '@/lib/uiStore';
import SimulatingOverlay from './ui/SimulatingOverlay';

export default function GlobalOverlay() {
  const isSimulating = useUIStore((state) => state.isSimulating);
  
  return <SimulatingOverlay isOpen={isSimulating} />;
}
