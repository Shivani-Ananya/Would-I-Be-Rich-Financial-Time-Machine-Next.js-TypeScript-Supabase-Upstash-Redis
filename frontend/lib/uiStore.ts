import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface UIState {
  // ─── Theme ────────────────────────────────────────────────
  isDark: boolean;
  toggleTheme: () => void;

  // ─── Toast queue ─────────────────────────────────────────
  toasts: Toast[];
  addToast: (message: string, variant?: ToastVariant) => void;
  removeToast: (id: string) => void;

  // ─── Loading overlay (for simulation in-progress) ─────────
  isSimulating: boolean;
  setSimulating: (v: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Theme defaults to dark (premium vibe)
      isDark: true,
      toggleTheme: () => set((s) => ({ isDark: !s.isDark })),

      // Toast queue (not persisted)
      toasts: [],
      addToast: (message, variant = 'info') =>
        set((s) => ({
          toasts: [
            ...s.toasts,
            { id: `toast-${Date.now()}-${Math.random()}`, message, variant },
          ].slice(-5),
        })),
      removeToast: (id) =>
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      // Simulation loading state
      isSimulating: false,
      setSimulating: (v) => set({ isSimulating: v }),
    }),
    {
      name: 'wibr-ui-storage',
      // Only persist the theme preference
      partialize: (state) => ({ isDark: state.isDark }),
    }
  )
);
