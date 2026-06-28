'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, TrendingUp, Sun, Moon } from 'lucide-react';
import { useUIStore } from '@/lib/uiStore';
import { useEffect } from 'react';

const NAV_LINKS = [
  { href: '/scenarios',  label: 'Scenarios' },
  { href: '/custom',     label: 'Build My Own' },
  { href: '/how-it-works', label: 'How It Works' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useUIStore();

  // Handle dark mode class on html element
  useEffect(() => {
    // Initial sync
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-500">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* ── Brand Logo ── */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform hover:scale-[1.02] active:scale-[0.98]"
          aria-label="Would I Be Rich If Home — Return to start"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded bg-brand/10 border border-brand/30 group-hover:border-brand/60 transition-colors">
            <TrendingUp size={16} className="text-brand" aria-hidden="true" />
          </span>
          <span className="font-extrabold text-foreground tracking-tight text-lg leading-none">
            Would I Be{' '}
            <span className="text-brand">Rich If</span>
            <span className="text-foreground/30">...?</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <ul className="hidden sm:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                    ${isActive
                      ? 'bg-brand text-background'
                      : 'text-foreground/70 hover:text-foreground hover:bg-brand/10'
                    }
                  `}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Desktop CTA & Theme ── */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-foreground/60 hover:text-brand hover:bg-brand/10 transition-all duration-300"
            aria-label={isDark ? 'Switch to light parchment mode' : 'Switch to dark onyx mode'}
          >
            {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          </button>
          
          <Link
            href="/scenarios"
            className="
              inline-flex items-center gap-1.5 rounded-full
              bg-brand px-6 py-2 text-sm font-bold text-background
              hover:opacity-90 transition-all duration-300 translate-y-0 hover:-translate-y-0.5
              shadow-lg shadow-brand/10
            "
          >
            Explore →
          </Link>
        </div>

        {/* ── Mobile hamburger & Theme ── */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-foreground/60 hover:text-brand hover:bg-brand/10 transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
          </button>
          
          <button
            className="p-2 rounded-full text-foreground/60 hover:text-brand hover:bg-brand/10 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* ── Mobile menu panel ── */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="sm:hidden border-t border-border bg-background px-4 py-4 space-y-1 animate-in slide-in-from-top duration-300"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  block px-4 py-3 rounded-xl text-base font-bold transition-colors
                  ${isActive
                    ? 'bg-brand text-background'
                    : 'text-foreground/70 hover:text-foreground hover:bg-brand/10'
                  }
                `}
              >
                {label}
              </Link>
            );
          })}
          <Link
            href="/scenarios"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-center mt-4 rounded-full bg-brand px-4 py-3 text-base font-bold text-background"
          >
            Explore Scenarios →
          </Link>
        </div>
      )}
    </header>
  );
}
