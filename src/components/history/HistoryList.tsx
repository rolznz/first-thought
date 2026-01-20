import { formatDateTime, formatDuration } from "@/lib/formatters";
import type { Session } from "@/types";

interface HistoryListProps {
  sessions: Session[];
  onEditSession: (session: Session) => void;
}

export function HistoryList({ sessions, onEditSession }: HistoryListProps) {
  if (sessions.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">No sessions yet.</p>
    );
  }

  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
      {sessions.map((session) => (
        <button
          key={session.id}
          onClick={() => onEditSession(session)}
          className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {formatDateTime(session.createdAt)}
            </span>
            <span className="font-mono">
              {formatDuration(session.durationMs)}
            </span>
          </div>
          <p className="font-medium mt-1">{session.tag}</p>
        </button>
      ))}
    </div>
  );
}
