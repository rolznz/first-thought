import type { Session, TagFrequency } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionStore {
  sessions: Session[];
  tagFrequencies: TagFrequency[];
  isExampleData: boolean;
  addSession: (session: Omit<Session, "id" | "createdAt">) => Session;
  updateSession: (id: string, updates: Partial<Pick<Session, "tag">>) => void;
  deleteSession: (id: string) => void;
  clearAllSessions: () => void;
  getTagSuggestions: (prefix: string) => TagFrequency[];
  loadExampleData: () => void;
}

const EXAMPLE_TAGS = [
  "work",
  "family",
  "health",
  "exercise",
  "pets",
  "sleep",
  "stress",
  "gratitude",
  "reading",
  "writing",
  "music",
  "cooking",
  "creativity",
  "career",
  "relationships",
  "finances",
  "goals",
  "productivity",
  "ideas",
  "happiness",
  "dreams",
  "nature",
  "learning",
  "gardening",
];

function generateExampleData(): {
  sessions: Session[];
  tagFrequencies: TagFrequency[];
} {
  const sessions: Session[] = [];
  const tagCounts: Record<string, { count: number; lastUsedAt: number }> = {};
  const now = Date.now();
  const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000;

  for (let day = 0; day < 14; day++) {
    const dayStart = twoWeeksAgo + day * 24 * 60 * 60 * 1000;
    const totalMinutes = Math.floor(Math.random() * 61); // 0-60 minutes

    if (totalMinutes === 0) continue;

    // Decide how many sessions for this day (1-3)
    const numSessions = Math.min(
      Math.ceil(Math.random() * 3),
      Math.ceil(totalMinutes / 5),
    );
    let remainingMinutes = totalMinutes;

    for (let s = 0; s < numSessions && remainingMinutes > 0; s++) {
      const isLast = s === numSessions - 1;
      const duration = isLast
        ? remainingMinutes
        : Math.max(1, Math.floor(Math.random() * remainingMinutes * 0.7));
      remainingMinutes -= duration;

      const durationMs = duration * 60 * 1000;
      const tag = EXAMPLE_TAGS[Math.floor(Math.random() * EXAMPLE_TAGS.length)];

      // Random time during the day (6am to 10pm)
      const hourOffset = 6 + Math.floor(Math.random() * 16);
      const minuteOffset = Math.floor(Math.random() * 60);
      const startedAt =
        dayStart + hourOffset * 60 * 60 * 1000 + minuteOffset * 60 * 1000;
      const endedAt = startedAt + durationMs;

      sessions.push({
        id: crypto.randomUUID(),
        startedAt,
        endedAt,
        durationMs,
        tag,
        createdAt: endedAt,
      });

      if (!tagCounts[tag]) {
        tagCounts[tag] = { count: 0, lastUsedAt: 0 };
      }
      tagCounts[tag].count++;
      tagCounts[tag].lastUsedAt = Math.max(tagCounts[tag].lastUsedAt, endedAt);
    }
  }

  // Sort sessions by createdAt descending (most recent first)
  sessions.sort((a, b) => b.createdAt - a.createdAt);

  const tagFrequencies: TagFrequency[] = Object.entries(tagCounts).map(
    ([tag, data]) => ({
      tag,
      count: data.count,
      lastUsedAt: data.lastUsedAt,
    }),
  );

  return { sessions, tagFrequencies };
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      tagFrequencies: [],
      isExampleData: false,

      addSession: (sessionData) => {
        const session: Session = {
          ...sessionData,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        };

        set((state) => {
          const existingFreq = state.tagFrequencies.find(
            (tf) => tf.tag === session.tag,
          );

          const newFrequencies = existingFreq
            ? state.tagFrequencies.map((tf) =>
                tf.tag === session.tag
                  ? { ...tf, count: tf.count + 1, lastUsedAt: Date.now() }
                  : tf,
              )
            : [
                ...state.tagFrequencies,
                { tag: session.tag, count: 1, lastUsedAt: Date.now() },
              ];

          return {
            sessions: [session, ...state.sessions],
            tagFrequencies: newFrequencies,
          };
        });

        return session;
      },

      updateSession: (id, updates) => {
        set((state) => {
          const oldSession = state.sessions.find((s) => s.id === id);
          if (!oldSession) return state;

          let newFrequencies = state.tagFrequencies;

          if (updates.tag && updates.tag !== oldSession.tag) {
            // Decrement old tag count
            newFrequencies = newFrequencies
              .map((tf) =>
                tf.tag === oldSession.tag ? { ...tf, count: tf.count - 1 } : tf,
              )
              .filter((tf) => tf.count > 0);

            // Increment new tag count
            const existingFreq = newFrequencies.find(
              (tf) => tf.tag === updates.tag,
            );
            if (existingFreq) {
              newFrequencies = newFrequencies.map((tf) =>
                tf.tag === updates.tag
                  ? { ...tf, count: tf.count + 1, lastUsedAt: Date.now() }
                  : tf,
              );
            } else {
              newFrequencies = [
                ...newFrequencies,
                { tag: updates.tag, count: 1, lastUsedAt: Date.now() },
              ];
            }
          }

          return {
            sessions: state.sessions.map((s) =>
              s.id === id ? { ...s, ...updates } : s,
            ),
            tagFrequencies: newFrequencies,
          };
        });
      },

      deleteSession: (id) => {
        set((state) => {
          const session = state.sessions.find((s) => s.id === id);
          if (!session) return state;

          const newFrequencies = state.tagFrequencies
            .map((tf) =>
              tf.tag === session.tag ? { ...tf, count: tf.count - 1 } : tf,
            )
            .filter((tf) => tf.count > 0);

          return {
            sessions: state.sessions.filter((s) => s.id !== id),
            tagFrequencies: newFrequencies,
          };
        });
      },

      clearAllSessions: () => {
        set({ sessions: [], tagFrequencies: [], isExampleData: false });
      },

      loadExampleData: () => {
        const { sessions, tagFrequencies } = generateExampleData();
        set({ sessions, tagFrequencies, isExampleData: true });
      },

      getTagSuggestions: (prefix) => {
        const { tagFrequencies } = get();
        const lowerPrefix = prefix.toLowerCase();

        return tagFrequencies
          .filter((tf) => tf.tag.startsWith(lowerPrefix))
          .sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            return b.lastUsedAt - a.lastUsedAt;
          })
          .slice(0, 5);
      },
    }),
    {
      name: "first-thought-sessions",
      version: 1,
    },
  ),
);
