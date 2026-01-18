import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useShare } from '@/hooks/useShare';
import { getNextMilestone, getTotalDurationInPeriod } from '@/lib/achievements';
import { formatDurationLong } from '@/lib/formatters';
import { useSessionStore } from '@/stores/sessionStore';
import type { Achievement, AchievementPeriod } from '@/types';

interface LocationState {
  milestone: Achievement;
  period: AchievementPeriod;
  newRecords: AchievementPeriod[];
  sessionId: string;
  sessionDuration: number;
  sessionTag: string;
}

const PERIOD_LABELS: Record<AchievementPeriod, string> = {
  day: 'today',
  week: 'this week',
  month: 'this month',
  allTime: 'all time',
};

export function AchievementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { share } = useShare();
  const { sessions } = useSessionStore();
  const [copied, setCopied] = useState(false);

  const state = location.state as LocationState | null;

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) return null;

  const { milestone, period, newRecords, sessionId, sessionDuration, sessionTag } = state;

  const totalDuration = getTotalDurationInPeriod(sessions, period);
  const nextMilestone = getNextMilestone(sessions, period);

  const handleShare = async () => {
    const result = await share({
      type: 'achievement',
      milestone: milestone.label,
    });

    if (result.success && result.method === 'clipboard') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinue = () => {
    if (newRecords.length > 0) {
      navigate('/record', {
        state: {
          period: newRecords[0],
          sessionId,
          sessionDuration,
          sessionTag,
        },
      });
    } else {
      navigate('/recorded', {
        state: {
          sessionId,
          sessionDuration,
          sessionTag,
        },
      });
    }
  };

  return (
    <div className="min-h-svh flex flex-col p-4">
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-4">Achievement!</h2>

        <p className="text-muted-foreground mb-6">
          You've reached: Total time meditated {PERIOD_LABELS[period]} — {milestone.label}
        </p>

        <p className="text-lg mb-2">
          Level: {milestone.label} unlocked
        </p>

        {nextMilestone && (
          <p className="text-sm text-muted-foreground mb-8">
            Progress: {formatDurationLong(totalDuration)} / {nextMilestone.label} (next)
          </p>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            {copied ? 'Copied!' : 'Share'}
          </Button>
          <Button onClick={handleContinue}>
            Nice — continue
          </Button>
        </div>
      </main>
    </div>
  );
}
