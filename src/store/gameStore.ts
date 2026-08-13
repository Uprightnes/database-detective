import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CaseProgress, QueryResult } from '../types';

interface GameState {
  // Active session
  activeCaseId: string | null;
  activeChapterId: string | null;
  currentQuery: string;
  queryResult: QueryResult;
  queryError: string | null;
  partnerMessage: string;
  hintIndex: number; // which hint has been revealed (0 = none)
  isHardMode: boolean;
  queriesThisChapter: number;

  // Persisted progress
  caseProgress: Record<string, CaseProgress>;

  // Actions
  startCase: (caseId: string, hardMode?: boolean) => void;
  setQuery: (query: string) => void;
  setQueryResult: (result: QueryResult, error: string | null) => void;
  setPartnerMessage: (msg: string) => void;
  revealNextHint: () => void;
  completeChapter: (chapterId: string, caseId: string) => void;
  completeCase: (caseId: string) => void;
  resetChapterHints: () => void;
  incrementQueryCount: () => void;
}

const defaultPartner = "Run a query and let's see what the data says.";

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      activeCaseId: null,
      activeChapterId: null,
      currentQuery: '',
      queryResult: null,
      queryError: null,
      partnerMessage: defaultPartner,
      hintIndex: 0,
      isHardMode: false,
      queriesThisChapter: 0,
      caseProgress: {},

      startCase: (caseId, hardMode = false) => {
        const existing = get().caseProgress[caseId];
        set({
          activeCaseId: caseId,
          activeChapterId: null,
          currentQuery: '',
          queryResult: null,
          queryError: null,
          partnerMessage: defaultPartner,
          hintIndex: 0,
          isHardMode: hardMode,
          queriesThisChapter: 0,
        });
        if (!existing) {
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
        }
      },

      setQuery: (query) => set({ currentQuery: query }),

      setQueryResult: (result, error) =>
        set({ queryResult: result, queryError: error }),

      setPartnerMessage: (msg) => set({ partnerMessage: msg }),

      revealNextHint: () => {
        const { hintIndex, activeCaseId, caseProgress } = get();
        if (!activeCaseId) return;
        const newIndex = hintIndex + 1;
        set({ hintIndex: newIndex });
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
          const already = existing.completedChapters.includes(chapterId);
          if (already) return state;
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

      completeCase: (caseId) => {
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
    }),
    {
      name: 'db-detective-progress',
      partialize: (state) => ({ caseProgress: state.caseProgress }),
    }
  )
);
