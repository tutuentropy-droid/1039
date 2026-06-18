import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizGameState, UnlockableItem, DifficultyLevel } from '@/types';
import { getLevelInfo, getNewUnlocks } from '@/data/quizGameData';

interface QuizGameStore extends QuizGameState {
  addExp: (amount: number) => { levelUp: boolean; newLevel: number; unlockedItems: UnlockableItem[] };
  completeQuiz: (quizId: string, score: number) => void;
  completeMatchingGame: (gameId: string, score: number) => void;
  completeCategorizationGame: (gameId: string, score: number) => void;
  updateStreak: () => void;
  resetGame: () => void;
  getCurrentLevelInfo: () => ReturnType<typeof getLevelInfo>;
}

const createInitialState = (): QuizGameState => ({
  level: 1,
  exp: 0,
  totalExp: 0,
  unlockedPhilosophers: ['confucius'],
  unlockedEvents: ['event-baijia'],
  unlockedWorks: [],
  completedQuizzes: [],
  completedMatchingGames: [],
  completedCategorizationGames: [],
  highScores: {},
  streak: 0,
  lastPlayDate: undefined,
});

export const useQuizGameStore = create<QuizGameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      addExp: (amount: number) => {
        const currentExp = get().exp;
        const currentLevel = get().level;
        const newTotalExp = get().totalExp + amount;
        const newExp = currentExp + amount;
        
        const { level: newLevelInfo } = getLevelInfo(newExp);
        const newLevel = newLevelInfo.level;
        
        const levelUp = newLevel > currentLevel;
        const unlockedItems = levelUp ? getNewUnlocks(currentLevel, newLevel) : [];
        
        const newUnlockedPhilosophers = [...get().unlockedPhilosophers];
        const newUnlockedEvents = [...get().unlockedEvents];
        
        unlockedItems.forEach(item => {
          if (item.type === 'philosopher' && !newUnlockedPhilosophers.includes(item.refId)) {
            newUnlockedPhilosophers.push(item.refId);
          }
          if (item.type === 'event' && !newUnlockedEvents.includes(item.refId)) {
            newUnlockedEvents.push(item.refId);
          }
        });
        
        set({
          exp: newExp,
          totalExp: newTotalExp,
          level: newLevel,
          unlockedPhilosophers: newUnlockedPhilosophers,
          unlockedEvents: newUnlockedEvents,
        });
        
        return { levelUp, newLevel, unlockedItems };
      },

      completeQuiz: (quizId: string, score: number) => {
        const { completedQuizzes, highScores } = get();
        const newCompleted = completedQuizzes.includes(quizId)
          ? completedQuizzes
          : [...completedQuizzes, quizId];
        const prevScore = highScores[quizId] || 0;
        
        set({
          completedQuizzes: newCompleted,
          highScores: {
            ...highScores,
            [quizId]: Math.max(prevScore, score),
          },
        });
      },

      completeMatchingGame: (gameId: string, score: number) => {
        const { completedMatchingGames, highScores } = get();
        const newCompleted = completedMatchingGames.includes(gameId)
          ? completedMatchingGames
          : [...completedMatchingGames, gameId];
        const prevScore = highScores[gameId] || 0;
        
        set({
          completedMatchingGames: newCompleted,
          highScores: {
            ...highScores,
            [gameId]: Math.max(prevScore, score),
          },
        });
      },

      completeCategorizationGame: (gameId: string, score: number) => {
        const { completedCategorizationGames, highScores } = get();
        const newCompleted = completedCategorizationGames.includes(gameId)
          ? completedCategorizationGames
          : [...completedCategorizationGames, gameId];
        const prevScore = highScores[gameId] || 0;
        
        set({
          completedCategorizationGames: newCompleted,
          highScores: {
            ...highScores,
            [gameId]: Math.max(prevScore, score),
          },
        });
      },

      updateStreak: () => {
        const { streak, lastPlayDate } = get();
        const today = new Date().setHours(0, 0, 0, 0);
        const yesterday = new Date(today - 86400000).getTime();
        
        let newStreak = streak;
        
        if (lastPlayDate) {
          const lastPlayDay = new Date(lastPlayDate).setHours(0, 0, 0, 0);
          if (lastPlayDay === today) {
          } else if (lastPlayDay === yesterday) {
            newStreak = streak + 1;
          } else {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }
        
        set({
          streak: newStreak,
          lastPlayDate: Date.now(),
        });
      },

      resetGame: () => set(createInitialState()),

      getCurrentLevelInfo: () => {
        return getLevelInfo(get().exp);
      },
    }),
    {
      name: 'quiz-game-storage',
      partialize: (state) => ({
        level: state.level,
        exp: state.exp,
        totalExp: state.totalExp,
        unlockedPhilosophers: state.unlockedPhilosophers,
        unlockedEvents: state.unlockedEvents,
        unlockedWorks: state.unlockedWorks,
        completedQuizzes: state.completedQuizzes,
        completedMatchingGames: state.completedMatchingGames,
        completedCategorizationGames: state.completedCategorizationGames,
        highScores: state.highScores,
        streak: state.streak,
        lastPlayDate: state.lastPlayDate,
      }),
    }
  )
);
