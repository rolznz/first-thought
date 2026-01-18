import type { AchievementPeriod, Session } from '@/types';
import { getSessionsInPeriod, getTotalDurationInPeriod } from './achievements';

export function getAverageDuration(sessions: Session[]): number {
  if (!sessions.length) {
    return 0;
  }
  return sessions.map(s => s.durationMs).reduce((a,b) => a + b, 0) / sessions.length;
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
  averageDuration: number;
  bestSession: Session | null;
}

export function getDailyStats(sessions: Session[]): DailyStats {
  const todaySessions = getSessionsInPeriod(sessions, 'day');

  return {
    sessionCount: todaySessions.length,
    totalDuration: getTotalDurationInPeriod(sessions, 'day'),
    averageDuration: getAverageDuration(todaySessions),
    bestSession: getBestSession(todaySessions),
  };
}

export function getPeriodStats(sessions: Session[], period: AchievementPeriod) {
  const periodSessions = getSessionsInPeriod(sessions, period);

  return {
    sessionCount: periodSessions.length,
    totalDuration: getTotalDurationInPeriod(sessions, period),
    averageDuration: getAverageDuration(periodSessions),
    bestSession: getBestSession(periodSessions),
  };
}
