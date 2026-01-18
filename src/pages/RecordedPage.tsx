import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useSessionStore } from '@/stores/sessionStore';
import { getDailyStats } from '@/lib/statistics';
import { formatDuration } from '@/lib/formatters';

interface LocationState {
  sessionId: string;
  sessionDuration: number;
  sessionTag: string;
}

export function RecordedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessions } = useSessionStore();

  const state = location.state as LocationState | null;

  useEffect(() => {
    if (!state) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) return null;

  const { sessionDuration, sessionTag } = state;
  const stats = getDailyStats(sessions);

  const handleDone = () => {
    navigate('/');
  };

  return (
    <div className="min-h-svh flex flex-col p-4">
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-4">Session recorded</h2>

        <p className="text-muted-foreground mb-8">
          Duration: {formatDuration(sessionDuration)} &nbsp;&nbsp; Tag: {sessionTag}
        </p>

        <div className="space-y-2 text-sm mb-8">
          <p>Sessions today: {stats.sessionCount}</p>
          <p>Median duration (today): {formatDuration(stats.medianDuration)}</p>
          {stats.bestSession && (
            <p>Best session (today): {formatDuration(stats.bestSession.durationMs)}</p>
          )}
        </div>

        <Button onClick={handleDone}>
          Done
        </Button>
      </main>
    </div>
  );
}
