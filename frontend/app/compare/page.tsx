import type { Metadata } from 'next';
import ComparisonDashboard from '@/components/ComparisonDashboard';

export const metadata: Metadata = {
  title: 'Compare Spending vs Investments — Would I Be Rich If...?',
  description: 'Track your expenses and instantly see how they would perform across different investment classes over 10 years.',
};

export default function ComparePage() {
  return (
    <main className="min-h-screen bg-[#070B1A]">
      <ComparisonDashboard />
    </main>
  );
}
