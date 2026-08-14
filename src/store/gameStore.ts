import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CaseProgress, QueryResult } from '../types';

interface GameState {
  activeCaseId: string | null;
  currentQuery: string;
  queryResult: QueryResult;
  queryError: string | null;
  partnerMessage: string;
  hintIndex: number;
  isHardMode: boolean;
  queriesThisChapter: number;
  // Timer (seconds elapsed, incremented externally by GamePage)
  timerSeconds: number;

  caseProgress: Record<string, CaseProgress>;

  startCase: (caseId: string, hardMode?: boolean) => void;
  setQuery: (query: string) => void;
  setQueryResult: (result: QueryResult, error: string | null) => void;
  setPartnerMessage: (msg: string) => void;
  revealNextHint: () => void;
  completeChapter: (chapterId: string, caseId: string) => void;
  completeCase: (caseId: string, elapsedSeconds: number) => void;
  resetChapterHints: () => void;
  incrementQueryCount: () => void;
  tickTimer: () => void;
}

const defaultPartner = "Run a query and let's see what the data says.";

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      activeCaseId: null,
      currentQuery: '',
      queryResult: null,
      queryError: null,
      partnerMessage: defaultPartner,
      hintIndex: 0,
      isHardMode: false,
      queriesThisChapter: 0,
      timerSeconds: 0,
      caseProgress: {},

      startCase: (caseId, hardMode = false) => {
        set({
          activeCaseId: caseId,
          currentQuery: '',
          queryResult: null,
          queryError: null,
          partnerMessage: defaultPartner,
          hintIndex: 0,
          isHardMode: hardMode,
          queriesThisChapter: 0,
          timerSeconds: 0,
        });
        // Always reset progress when starting (covers replay)
        set((state) => ({
          caseProgress: {
            ...state.caseProgress,
            [caseId]: {
              caseId,
              completedChapters: [],
              hintsUsed: 0,
              queriesRun: 0,
              startedAt: Date.now(),
            },
          },
        }));
      },

      setQuery: (query) => set({ currentQuery: query }),
      setQueryResult: (result, error) => set({ queryResult: result, queryError: error }),
      setPartnerMessage: (msg) => set({ partnerMessage: msg }),

      revealNextHint: () => {
        const { hintIndex, activeCaseId } = get();
        if (!activeCaseId) return;
        set({ hintIndex: hintIndex + 1 });
        set((state) => ({
          caseProgress: {
            ...state.caseProgress,
            [activeCaseId]: {
              ...state.caseProgress[activeCaseId],
              hintsUsed: (state.caseProgress[activeCaseId]?.hintsUsed || 0) + 1,
            },
          },
        }));
      },

      completeChapter: (chapterId, caseId) => {
        set((state) => {
          const existing = state.caseProgress[caseId];
          if (!existing) return state;
          if (existing.completedChapters.includes(chapterId)) return state;
          return {
            caseProgress: {
              ...state.caseProgress,
              [caseId]: {
                ...existing,
                completedChapters: [...existing.completedChapters, chapterId],
              },
            },
            hintIndex: 0,
            queriesThisChapter: 0,
          };
        });
      },

      completeCase: (caseId, elapsedSeconds) => {
        set((state) => {
          const existing = state.caseProgress[caseId];
          if (!existing) return state;
          const { hintsUsed, queriesRun } = existing;
          let rating: CaseProgress['rating'] = 'Chief';
          if (hintsUsed > 0 || queriesRun > 15) rating = 'Senior Detective';
          if (hintsUsed > 3 || queriesRun > 25) rating = 'Detective';
          if (hintsUsed > 6 || queriesRun > 40) rating = 'Rookie';
          return {
            caseProgress: {
              ...state.caseProgress,
              [caseId]: {
                ...existing,
                completedAt: Date.now(),
                elapsedSeconds,
                rating,
              },
            },
          };
        });
      },

      resetChapterHints: () => set({ hintIndex: 0 }),

      incrementQueryCount: () => {
        const { activeCaseId } = get();
        if (!activeCaseId) return;
        set((state) => ({
          queriesThisChapter: state.queriesThisChapter + 1,
          caseProgress: {
            ...state.caseProgress,
            [activeCaseId]: {
              ...state.caseProgress[activeCaseId],
              queriesRun: (state.caseProgress[activeCaseId]?.queriesRun || 0) + 1,
            },
          },
        }));
      },

      tickTimer: () => set((state) => ({ timerSeconds: state.timerSeconds + 1 })),
    }),
    {
      name: 'sql-precinct-progress',
      partialize: (state) => ({ caseProgress: state.caseProgress }),
    }
  )
);
