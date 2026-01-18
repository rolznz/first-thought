import type { Session, AchievementPeriod } from '@/types';
import { getSessionsInPeriod, getTotalDurationInPeriod } from './achievements';

export function getMedianDuration(sessions: Session[]): number {
  if (sessions.length === 0) return 0;

  const sorted = [...sessions].sort((a, b) => a.durationMs - b.durationMs);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.floor((sorted[mid - 1].durationMs + sorted[mid].durationMs) / 2);
  }
  return sorted[mid].durationMs;
}

export function getBestSession(sessions: Session[]): Session | null {
  if (sessions.length === 0) return null;

  return sessions.reduce((best, session) =>
    session.durationMs > best.durationMs ? session : best
  );
}

export interface DailyStats {
  sessionCount: number;
  totalDuration: number;
  medianDuration: number;
  bestSession: Session | null;
}

export function getDailyStats(sessions: Session[]): DailyStats {
  const todaySessions = getSessionsInPeriod(sessions, 'day');

  return {
    sessionCount: todaySessions.length,
    totalDuration: getTotalDurationInPeriod(sessions, 'day'),
    medianDuration: getMedianDuration(todaySessions),
    bestSession: getBestSession(todaySessions),
  };
}

export function getPeriodStats(sessions: Session[], period: AchievementPeriod) {
  const periodSessions = getSessionsInPeriod(sessions, period);

  return {
    sessionCount: periodSessions.length,
    totalDuration: getTotalDurationInPeriod(sessions, period),
    medianDuration: getMedianDuration(periodSessions),
    bestSession: getBestSession(periodSessions),
  };
}
