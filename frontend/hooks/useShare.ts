import { useState, useCallback } from 'react';

/**
 * useShare — wraps the browser Clipboard API with a graceful execCommand fallback.
 * Returns { copied, share } where share(url) copies the URL and sets
 * copied=true for 2.5 seconds, then resets.
 */
export function useShare() {
  const [copied, setCopied] = useState(false);

  const share = useCallback(async (url: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for Safari / older browsers
        const el = document.createElement('textarea');
        el.value = url;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('[useShare] clipboard write failed:', err);
    }
  }, []);

  return { copied, share };
}
