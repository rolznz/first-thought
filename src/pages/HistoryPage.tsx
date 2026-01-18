import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { formatDateTime, formatDuration } from '@/lib/formatters';
import { getDailyStats } from '@/lib/statistics';
import { useSessionStore } from '@/stores/sessionStore';
import type { Session } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function HistoryPage() {
  const navigate = useNavigate();
  const { sessions, updateSession, deleteSession, clearAllSessions } = useSessionStore();
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [editTag, setEditTag] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);

  const stats = getDailyStats(sessions);

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setEditTag(session.tag);
  };

  const handleSaveEdit = () => {
    if (editingSession && editTag.trim()) {
      updateSession(editingSession.id, { tag: editTag.trim().toLowerCase() });
      setEditingSession(null);
    }
  };

  const handleDeleteSession = () => {
    if (editingSession) {
      deleteSession(editingSession.id);
      setEditingSession(null);
    }
  };

  const handleClearAll = () => {
    clearAllSessions();
    setShowClearDialog(false);
  };

  return (
    <div className="min-h-svh flex flex-col">
      <header className="flex items-center gap-2 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">History</h1>
      </header>

      <main className="flex-1 overflow-auto p-4">
        {sessions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No sessions yet.</p>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => handleEditSession(session)}
                className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {formatDateTime(session.createdAt)}
                  </span>
                  <span className="font-mono">{formatDuration(session.durationMs)}</span>
                </div>
                <p className="font-medium mt-1">{session.tag}</p>
              </button>
            ))}
          </div>
        )}

        {sessions.length > 0 && (
          <div className="mt-6 pt-4 border-t space-y-1 text-sm text-muted-foreground">
            <p>Average duration (today): {formatDuration(stats.averageDuration)}</p>
            <p>Sessions today: {stats.sessionCount}</p>
          </div>
        )}
      </main>

      <footer className="p-4 border-t flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowClearDialog(true)}
          disabled={sessions.length === 0}
        >
          Clear all
        </Button>
        <Button variant="ghost" className="flex-1" onClick={() => navigate('/')}>
          Back
        </Button>
      </footer>

      {/* Edit Session Dialog */}
      <Dialog open={!!editingSession} onOpenChange={() => setEditingSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
            <DialogDescription>
              {editingSession && (
                <>
                  {formatDateTime(editingSession.createdAt)} · {formatDuration(editingSession.durationMs)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Tag</label>
            <Input
              value={editTag}
              onChange={(e) => setEditTag(e.target.value.trim().toLowerCase().replace(/\s+/g, ''))}
              placeholder="Enter tag..."
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="destructive" onClick={handleDeleteSession}>
              Delete
            </Button>
            <Button onClick={handleSaveEdit} disabled={!editTag.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all sessions?</DialogTitle>
            <DialogDescription>
              This will permanently delete all {sessions.length} session{sessions.length !== 1 ? 's' : ''}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              Clear all
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
