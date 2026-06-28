import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '../components/Providers';
import ToastContainer from '../components/ui/ToastContainer';
import GlobalOverlay from '../components/GlobalOverlay';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-primary',
});

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-all duration-700">
        <Providers>
          <div className="flex-1 relative z-10">
            {children}
          </div>
          <ToastContainer />
          <GlobalOverlay />
        </Providers>
      </body>
    </html>
  );
}
