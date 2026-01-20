import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryList } from "@/components/history/HistoryList";
import { HistoryGraph } from "@/components/history/HistoryGraph";
import { HistoryWordCloud } from "@/components/history/HistoryWordCloud";
import { formatDateTime, formatDuration } from "@/lib/formatters";
import { getDailyStats } from "@/lib/statistics";
import { useSessionStore } from "@/stores/sessionStore";
import type { Session } from "@/types";
import { ArrowLeft, BarChart3, Cloud, List, History } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function HistoryPage() {
  const navigate = useNavigate();
  const {
    sessions,
    tagFrequencies,
    isExampleData,
    updateSession,
    deleteSession,
    clearAllSessions,
    loadExampleData,
  } = useSessionStore();
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [editTag, setEditTag] = useState("");
  const [showClearDialog, setShowClearDialog] = useState(false);

  const stats = getDailyStats(sessions);

  const handleEditSession = (session: Session) => {
    setEditingSession(session);
    setEditTag(session.tag);
  };

  const handleSaveEdit = () => {
    if (editingSession && editTag.trim()) {
      updateSession(editingSession.id, {
        tag: editTag.trim().toLowerCase().trim().replace(/\s+/g, ""),
      });
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">History</h1>
      </header>

      <main className="flex-1 overflow-auto flex flex-col">
        {sessions.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <History className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-medium mb-2">No history yet</h2>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Complete your first session to start tracking your progress.
            </p>
            <Button variant="outline" onClick={loadExampleData}>
              View example data
            </Button>
          </div>
        ) : (
        <Tabs defaultValue="list" className="flex-1 flex flex-col">
          {isExampleData && (
            <div className="mx-4 mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground text-center">
              Viewing example data.{" "}
              <button
                onClick={clearAllSessions}
                className="underline hover:text-foreground"
              >
                Clear
              </button>
            </div>
          )}
          <div className="px-4 pt-4">
            <TabsList className="w-full">
              <TabsTrigger value="list" className="flex-1 gap-1.5">
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">List</span>
              </TabsTrigger>
              <TabsTrigger value="graph" className="flex-1 gap-1.5">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Graph</span>
              </TabsTrigger>
              <TabsTrigger value="cloud" className="flex-1 gap-1.5">
                <Cloud className="h-4 w-4" />
                <span className="hidden sm:inline">Cloud</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="flex-1 overflow-auto p-4">
            <HistoryList sessions={sessions} onEditSession={handleEditSession} />

            {sessions.length > 0 && (
              <div className="mt-6 pt-4 border-t space-y-1 text-sm text-muted-foreground">
                <p>
                  Average duration (today): {formatDuration(stats.averageDuration)}
                </p>
                <p>Sessions today: {stats.sessionCount}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="graph" className="flex-1 overflow-auto p-4">
            <HistoryGraph sessions={sessions} />
          </TabsContent>

          <TabsContent value="cloud" className="flex-1 overflow-auto p-4">
            <HistoryWordCloud tagFrequencies={tagFrequencies} />
          </TabsContent>
        </Tabs>
        )}
      </main>

      <footer className="p-4 border-t flex gap-2 pb-6">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowClearDialog(true)}
          disabled={sessions.length === 0}
        >
          Clear all
        </Button>
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() => navigate("/")}
        >
          Back
        </Button>
      </footer>

      {/* Edit Session Dialog */}
      <Dialog
        open={!!editingSession}
        onOpenChange={() => setEditingSession(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
            <DialogDescription>
              {editingSession && (
                <>
                  {formatDateTime(editingSession.createdAt)} ·{" "}
                  {formatDuration(editingSession.durationMs)}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Tag</label>
            <Input
              value={editTag}
              onChange={(e) => setEditTag(e.target.value)}
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
              This will permanently delete all {sessions.length} session
              {sessions.length !== 1 ? "s" : ""}. This action cannot be undone.
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
