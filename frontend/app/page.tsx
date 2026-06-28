import type { Metadata } from 'next';
import LandingUI from '@/components/LandingUI';

export const metadata: Metadata = {
  title: 'Would I Be Rich If...? — Financial Time Machine',
  description:
    'Discover what your wealth could look like with real historical data. Explore 28+ "what if" financial scenarios — crypto, stocks, real estate and more.',
  openGraph: {
    title: 'Would I Be Rich If...?',
    description: 'A free financial time machine built on real data.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070B1A]">
      <LandingUI />
    </main>
  );
}
