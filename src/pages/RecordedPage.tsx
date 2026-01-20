import { InstallPrompt } from "@/components/InstallPrompt";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/formatters";
import { getDailyStats } from "@/lib/statistics";
import { useSessionStore } from "@/stores/sessionStore";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
      navigate("/");
    }
  }, [state, navigate]);

  if (!state) return null;

  const { sessionDuration, sessionTag } = state;
  const stats = getDailyStats(sessions);

  const handleDone = () => {
    navigate("/");
  };

  return (
    <div className="min-h-svh flex flex-col p-4">
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-semibold mb-4">Session recorded</h2>

        <p className="text-muted-foreground mb-2">
          Duration: {formatDuration(sessionDuration)}
        </p>
        <p className="text-muted-foreground mb-8">Tag: {sessionTag}</p>

        <p className="mb-4">💭 Take a minute to reflect on your thought.</p>
        <p className="mb-4 text-sm">
          📒 Consider writing a small private note in your favorite notetaking
          app to help you resolve and free up some space in your mind.
        </p>

        <div className="space-y-2 text-sm mb-8 text-muted-foreground">
          <p>Sessions today: {stats.sessionCount}</p>
          <p>
            Average duration (today): {formatDuration(stats.averageDuration)}
          </p>
          {stats.bestSession && (
            <p>
              Best session (today):{" "}
              {formatDuration(stats.bestSession.durationMs)}
            </p>
          )}
        </div>

        <Button onClick={handleDone}>Done</Button>

        <InstallPrompt />
      </main>
    </div>
  );
}
