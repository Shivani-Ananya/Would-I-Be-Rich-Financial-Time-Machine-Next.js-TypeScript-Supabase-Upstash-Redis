import type { Metadata } from 'next';
import HowItWorksUI from '@/components/HowItWorksUI';

export const metadata: Metadata = {
  title: 'How It Works — Would I Be Rich If...?',
  description: 'Learn how to calculate your spending vs investment potential with our 10-step guide.',
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#070B1A]">
      <HowItWorksUI />
    </main>
  );
}
