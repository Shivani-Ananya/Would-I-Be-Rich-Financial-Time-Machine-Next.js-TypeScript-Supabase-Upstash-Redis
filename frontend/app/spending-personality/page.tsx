import type { Metadata } from 'next';
import SpendingPersonalityUI from '@/components/SpendingPersonalityUI';

export const metadata: Metadata = {
  title: 'Your Spending Personality — Would I Be Rich If...?',
  description: 'See how your daily spending habits could have made you rich if invested instead.',
};

export default function SpendingPersonalityPage() {
  return (
    <main className="min-h-screen bg-[#070B1A]">
      <SpendingPersonalityUI />
    </main>
  );
}
