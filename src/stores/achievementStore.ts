import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AchievementPeriod } from '@/types';

interface UnlockedMilestone {
  milestoneId: string;
  period: AchievementPeriod;
  unlockedAt: number;
}

interface PersonalRecord {
  period: AchievementPeriod;
  durationMs: number;
  sessionId: string;
  achievedAt: number;
}

interface AchievementStore {
  unlockedMilestones: UnlockedMilestone[];
  personalRecords: PersonalRecord[];
  unlockMilestone: (milestoneId: string, period: AchievementPeriod) => void;
  isMilestoneUnlocked: (milestoneId: string, period: AchievementPeriod) => boolean;
  setPersonalRecord: (period: AchievementPeriod, durationMs: number, sessionId: string) => void;
  getPersonalRecord: (period: AchievementPeriod) => PersonalRecord | undefined;
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlockedMilestones: [],
      personalRecords: [],

      unlockMilestone: (milestoneId, period) => {
        set((state) => ({
          unlockedMilestones: [
            ...state.unlockedMilestones,
            { milestoneId, period, unlockedAt: Date.now() },
          ],
        }));
      },

      isMilestoneUnlocked: (milestoneId, period) => {
        const { unlockedMilestones } = get();
        return unlockedMilestones.some(
          (m) => m.milestoneId === milestoneId && m.period === period
        );
      },

      setPersonalRecord: (period, durationMs, sessionId) => {
        set((state) => {
          const existingIndex = state.personalRecords.findIndex(
            (r) => r.period === period
          );

          const newRecord: PersonalRecord = {
            period,
            durationMs,
            sessionId,
            achievedAt: Date.now(),
          };

          if (existingIndex >= 0) {
            const updated = [...state.personalRecords];
            updated[existingIndex] = newRecord;
            return { personalRecords: updated };
          }

          return {
            personalRecords: [...state.personalRecords, newRecord],
          };
        });
      },

      getPersonalRecord: (period) => {
        const { personalRecords } = get();
        return personalRecords.find((r) => r.period === period);
      },
    }),
    {
      name: 'first-thought-achievements',
      version: 1,
    }
  )
);
