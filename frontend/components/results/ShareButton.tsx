'use client';

import { useShare } from '@/hooks/useShare';
import { useUIStore } from '@/lib/uiStore';
import { Share2, Check } from 'lucide-react';

interface ShareButtonProps {
  resultId: string;
}

export default function ShareButton({ resultId }: ShareButtonProps) {
  const { copied, share } = useShare();
  const { addToast } = useUIStore();

  const handleShare = async () => {
    const url = `${window.location.origin}/result/${resultId}`;
    await share(url);
    if (!copied) {
      addToast('Share link copied to clipboard! 🎉', 'success');
    }
  };

  return (
    <button
      id="share-result-button"
      onClick={handleShare}
      aria-label={copied ? 'Link copied to clipboard!' : 'Copy share link to clipboard'}
      className={`
        inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-sm
        transition-all duration-300 ease-out
        ${copied
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-95'
          : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-500 hover:text-white hover:bg-slate-700'
        }
      `}
    >
      {copied ? (
        <>
          <Check size={14} aria-hidden="true" />
          Link Copied!
        </>
      ) : (
        <>
          <Share2 size={14} aria-hidden="true" />
          Share Result
        </>
      )}
    </button>
  );
}
