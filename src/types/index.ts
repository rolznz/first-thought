export interface Session {
  id: string;
  startedAt: number;    // Unix timestamp
  endedAt: number;      // Unix timestamp
  durationMs: number;
  tag: string;          // Single word, lowercased
  createdAt: number;
}

export interface TagFrequency {
  tag: string;
  count: number;
  lastUsedAt: number;
}

export type AchievementPeriod = 'day' | 'week' | 'month' | 'allTime';

export interface Achievement {
  id: string;
  label: string;
  thresholdMs: number;
}

export interface TimerState {
  status: 'idle' | 'running' | 'completed';
  startedAt: number | null;
  pausedAt: number | null;
  durationMs: number;
}
