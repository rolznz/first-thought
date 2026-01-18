import { create } from 'zustand';
import type { TimerState } from '@/types';

interface TimerStore extends TimerState {
  start: () => void;
  pause: () => void;
  complete: () => void;
  reset: () => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
  status: 'idle',
  startedAt: null,
  pausedAt: null,
  durationMs: 0,

  start: () => {
    set({
      status: 'running',
      startedAt: Date.now(),
      pausedAt: null,
      durationMs: 0,
    });
  },

  pause: () => {
    set((state) => ({
      ...state,
      pausedAt: Date.now(),
    }));
  },

  complete: () => {
    set((state) => {
      const endTime = state.pausedAt || Date.now();
      const duration = state.startedAt ? endTime - state.startedAt : 0;
      return {
        status: 'completed',
        durationMs: duration,
      };
    });
  },

  reset: () => {
    set({
      status: 'idle',
      startedAt: null,
      pausedAt: null,
      durationMs: 0,
    });
  },
}));
