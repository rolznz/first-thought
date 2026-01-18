import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session, TagFrequency } from '@/types';

interface SessionStore {
  sessions: Session[];
  tagFrequencies: TagFrequency[];
  addSession: (session: Omit<Session, 'id' | 'createdAt'>) => Session;
  updateSession: (id: string, updates: Partial<Pick<Session, 'tag'>>) => void;
  deleteSession: (id: string) => void;
  clearAllSessions: () => void;
  getTagSuggestions: (prefix: string) => TagFrequency[];
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      tagFrequencies: [],

      addSession: (sessionData) => {
        const session: Session = {
          ...sessionData,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
        };

        set((state) => {
          const existingFreq = state.tagFrequencies.find(
            (tf) => tf.tag === session.tag
          );

          const newFrequencies = existingFreq
            ? state.tagFrequencies.map((tf) =>
                tf.tag === session.tag
                  ? { ...tf, count: tf.count + 1, lastUsedAt: Date.now() }
                  : tf
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
                tf.tag === oldSession.tag
                  ? { ...tf, count: tf.count - 1 }
                  : tf
              )
              .filter((tf) => tf.count > 0);

            // Increment new tag count
            const existingFreq = newFrequencies.find(
              (tf) => tf.tag === updates.tag
            );
            if (existingFreq) {
              newFrequencies = newFrequencies.map((tf) =>
                tf.tag === updates.tag
                  ? { ...tf, count: tf.count + 1, lastUsedAt: Date.now() }
                  : tf
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
              s.id === id ? { ...s, ...updates } : s
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
              tf.tag === session.tag ? { ...tf, count: tf.count - 1 } : tf
            )
            .filter((tf) => tf.count > 0);

          return {
            sessions: state.sessions.filter((s) => s.id !== id),
            tagFrequencies: newFrequencies,
          };
        });
      },

      clearAllSessions: () => {
        set({ sessions: [], tagFrequencies: [] });
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
      name: 'first-thought-sessions',
      version: 1,
    }
  )
);
