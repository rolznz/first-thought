import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTimer } from '@/hooks/useTimer';
import { useSessionStore } from '@/stores/sessionStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { formatDuration } from '@/lib/formatters';
import {
  getUnlockedMilestones,
  checkForNewRecord,
  MILESTONES,
} from '@/lib/achievements';
import type { AchievementPeriod, Achievement } from '@/types';

const PERIODS: AchievementPeriod[] = ['day', 'week', 'month', 'allTime'];

export function CapturePage() {
  const navigate = useNavigate();
  const { status, durationMs, startedAt, reset } = useTimer();
  const { sessions, addSession, getTagSuggestions } = useSessionStore();
  const { isMilestoneUnlocked, unlockMilestone, setPersonalRecord } = useAchievementStore();

  const [tag, setTag] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Redirect if no completed session
  useEffect(() => {
    if (status !== 'completed' || !startedAt) {
      navigate('/');
    }
  }, [status, startedAt, navigate]);

  const suggestions = tag.length >= 1 ? getTagSuggestions(tag) : [];
  const showSuggestions = isFocused && tag.length >= 1 && suggestions.length > 0;
  const showSave = tag.length >= 1;

  const validateTag = (input: string): string => {
    return input.trim().toLowerCase().replace(/\s+/g, '');
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validated = validateTag(e.target.value);
    setTag(validated);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setTag(suggestion);
    setIsFocused(false);
  };

  const handleCancel = () => {
    reset();
    navigate('/');
  };

  const handleSave = () => {
    if (!tag || !startedAt) return;

    const session = addSession({
      startedAt,
      endedAt: startedAt + durationMs,
      durationMs,
      tag,
    });

    // Check for new achievements across all periods
    const newAchievements: { milestone: Achievement; period: AchievementPeriod }[] = [];

    for (const period of PERIODS) {
      const unlockedInPeriod = getUnlockedMilestones(
        [...sessions, session],
        period,
        isMilestoneUnlocked
      );
      for (const milestone of unlockedInPeriod) {
        unlockMilestone(milestone.id, period);
        newAchievements.push({ milestone, period });
      }
    }

    // Check for new records
    const newRecords: AchievementPeriod[] = [];
    for (const period of PERIODS) {
      if (checkForNewRecord(durationMs, sessions, period)) {
        setPersonalRecord(period, durationMs, session.id);
        newRecords.push(period);
      }
    }

    reset();

    // Navigate through celebration pages if any
    if (newAchievements.length > 0) {
      // Get the highest milestone
      const highestMilestone = newAchievements.reduce((highest, current) => {
        const currentIdx = MILESTONES.findIndex((m) => m.id === current.milestone.id);
        const highestIdx = MILESTONES.findIndex((m) => m.id === highest.milestone.id);
        return currentIdx > highestIdx ? current : highest;
      });

      navigate('/achievement', {
        state: {
          milestone: highestMilestone.milestone,
          period: highestMilestone.period,
          newRecords,
          sessionId: session.id,
          sessionDuration: durationMs,
          sessionTag: tag,
        },
      });
    } else if (newRecords.length > 0) {
      navigate('/record', {
        state: {
          period: newRecords[0],
          sessionId: session.id,
          sessionDuration: durationMs,
          sessionTag: tag,
        },
      });
    } else {
      navigate('/recorded', {
        state: {
          sessionId: session.id,
          sessionDuration: durationMs,
          sessionTag: tag,
        },
      });
    }
  };

  return (
    <div className="min-h-svh flex flex-col p-4">
      <main className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-2">Session complete</h2>
        <p className="text-muted-foreground mb-8">
          Duration: {formatDuration(durationMs)}
        </p>

        <p className="text-center mb-4 max-w-xs text-sm">
          Describe the first thought that entered your mind
        </p>

        <div className="w-full max-w-xs relative">
          <Input
            type="text"
            placeholder="Enter a word..."
            value={tag}
            onChange={handleTagChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="mb-2"
          />

          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 bg-card border rounded-md shadow-lg z-10">
              <p className="px-3 py-2 text-xs text-muted-foreground border-b">
                Recent matches:
              </p>
              {suggestions.map((s) => (
                <button
                  key={s.tag}
                  type="button"
                  className="w-full px-3 py-2 text-left hover:bg-accent flex justify-between items-center"
                  onClick={() => handleSelectSuggestion(s.tag)}
                >
                  <span>{s.tag}</span>
                  <span className="text-muted-foreground text-sm">({s.count})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          {showSave && (
            <Button onClick={handleSave}>
              Save
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
