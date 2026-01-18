import type { Achievement, AchievementPeriod, Session } from '@/types';

export const MILESTONES: Achievement[] = [
  { id: '1m', label: '1 minute', thresholdMs: 1 * 60 * 1000 },
  { id: '5m', label: '5 minutes', thresholdMs: 5 * 60 * 1000 },
  { id: '15m', label: '15 minutes', thresholdMs: 15 * 60 * 1000 },
  { id: '30m', label: '30 minutes', thresholdMs: 30 * 60 * 1000 },
  { id: '1h', label: '1 hour', thresholdMs: 60 * 60 * 1000 },
  { id: '3h', label: '3 hours', thresholdMs: 3 * 60 * 60 * 1000 },
  { id: '6h', label: '6 hours', thresholdMs: 6 * 60 * 60 * 1000 },
  { id: '12h', label: '12 hours', thresholdMs: 12 * 60 * 60 * 1000 },
  { id: '1d', label: '1 day', thresholdMs: 24 * 60 * 60 * 1000 },
];

export function getPeriodStartTimestamp(period: AchievementPeriod): number {
  const now = new Date();

  switch (period) {
    case 'day': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return start.getTime();
    }
    case 'week': {
      const dayOfWeek = now.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday as start of week
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
      return start.getTime();
    }
    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return start.getTime();
    }
    case 'allTime':
      return 0;
  }
}

export function getSessionsInPeriod(sessions: Session[], period: AchievementPeriod): Session[] {
  const startTime = getPeriodStartTimestamp(period);
  return sessions.filter((s) => s.createdAt >= startTime);
}

export function getTotalDurationInPeriod(sessions: Session[], period: AchievementPeriod): number {
  return getSessionsInPeriod(sessions, period).reduce(
    (total, session) => total + session.durationMs,
    0
  );
}

export function getUnlockedMilestones(
  sessions: Session[],
  period: AchievementPeriod,
  alreadyUnlocked: (milestoneId: string, period: AchievementPeriod) => boolean
): Achievement[] {
  const totalDuration = getTotalDurationInPeriod(sessions, period);

  return MILESTONES.filter(
    (milestone) =>
      totalDuration >= milestone.thresholdMs &&
      !alreadyUnlocked(milestone.id, period)
  );
}

export function getNextMilestone(
  sessions: Session[],
  period: AchievementPeriod
): Achievement | null {
  const totalDuration = getTotalDurationInPeriod(sessions, period);

  for (const milestone of MILESTONES) {
    if (totalDuration < milestone.thresholdMs) {
      return milestone;
    }
  }
  return null;
}

export function checkForNewRecord(
  newSessionDuration: number,
  sessions: Session[],
  period: AchievementPeriod
): boolean {
  const periodSessions = getSessionsInPeriod(sessions, period);
  const previousMax = Math.max(
    0,
    ...periodSessions.map((s) => s.durationMs)
  );
  return newSessionDuration > previousMax;
}
