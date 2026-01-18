import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useShare } from '@/hooks/useShare';
import { formatDuration } from '@/lib/formatters';
import type { AchievementPeriod } from '@/types';

interface LocationState {
  period: AchievementPeriod;
  sessionId: string;
  sessionDuration: number;
  sessionTag: string;
}

const PERIOD_LABELS: Record<AchievementPeriod, string> = {
  day: 'Today',
  week: 'This week',
  month: 'This month',
  allTime: 'All time',
};

export function RecordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { share } = useShare();
  const [copied, setCopied] = useState(false);

  const state = location.state as LocationState | null;

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) return null;

  const { period, sessionId, sessionDuration, sessionTag } = state;

  const handleShare = async () => {
    const result = await share({
      type: 'record',
      duration: formatDuration(sessionDuration),
    });

    if (result.success && result.method === 'clipboard') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleContinue = () => {
    navigate('/recorded', {
      state: {
        sessionId,
        sessionDuration,
        sessionTag,
      },
    });
  };

  return (
    <div className="min-h-svh flex flex-col p-4">
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-4">New Record!</h2>

        <p className="text-muted-foreground mb-2">
          {PERIOD_LABELS[period]} personal best
        </p>

        <p className="text-4xl font-mono mb-2">
          {formatDuration(sessionDuration)}
        </p>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            {copied ? 'Copied!' : 'Share'}
          </Button>
          <Button onClick={handleContinue}>
            Cool — continue
          </Button>
        </div>
      </main>
    </div>
  );
}
