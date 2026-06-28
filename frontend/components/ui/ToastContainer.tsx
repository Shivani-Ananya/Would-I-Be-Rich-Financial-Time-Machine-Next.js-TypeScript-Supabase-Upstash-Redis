'use client';

import { useEffect } from 'react';
import { useUIStore, Toast } from '@/lib/uiStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useUIStore();

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const icons = {
    success: <CheckCircle size={16} className="text-emerald-400 shrink-0" aria-hidden="true" />,
    error: <AlertCircle size={16} className="text-red-400 shrink-0" aria-hidden="true" />,
    info: <Info size={16} className="text-blue-400 shrink-0" aria-hidden="true" />,
  };

  const borders = {
    success: 'border-emerald-800/60',
    error: 'border-red-800/60',
    info: 'border-blue-800/60',
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl
        bg-slate-900 border ${borders[toast.variant]}
        shadow-xl shadow-black/40 text-sm text-slate-200
        animate-in slide-in-from-bottom-2 duration-300
      `}
    >
      {icons[toast.variant]}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        aria-label="Dismiss notification"
        className="text-slate-500 hover:text-slate-300 transition-colors ml-2"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useUIStore();
  if (!toasts.length) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full"
      aria-label="Notifications"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
