import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Annotation, GoldenQuote, PhilosophyNote } from '@/types';

interface ReaderState {
  showOriginal: boolean;
  showTranslation: boolean;
  fontSize: number;
  highlightKeywords: boolean;
  annotations: Annotation[];
  goldenQuotes: GoldenQuote[];
  philosophyNotes: PhilosophyNote[];
  activeTab: 'reader' | 'quotes' | 'notes';

  setShowOriginal: (show: boolean) => void;
  setShowTranslation: (show: boolean) => void;
  setFontSize: (size: number) => void;
  setHighlightKeywords: (highlight: boolean) => void;
  setActiveTab: (tab: 'reader' | 'quotes' | 'notes') => void;

  addAnnotation: (annotation: Omit<Annotation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAnnotation: (id: string, text: string) => void;
  deleteAnnotation: (id: string) => void;
  getAnnotationsByChapter: (bookId: string, chapterId: string) => Annotation[];

  addGoldenQuote: (quote: Omit<GoldenQuote, 'id' | 'createdAt'>) => void;
  removeGoldenQuote: (id: string) => void;
  updateGoldenQuoteNote: (id: string, note: string) => void;
  isGoldenQuote: (bookId: string, chapterId: string, originalText: string) => boolean;

  addPhilosophyNote: (note: Omit<PhilosophyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePhilosophyNote: (id: string, updates: Partial<Pick<PhilosophyNote, 'title' | 'content' | 'tags'>>) => void;
  deletePhilosophyNote: (id: string) => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      showOriginal: true,
      showTranslation: true,
      fontSize: 18,
      highlightKeywords: true,
      annotations: [],
      goldenQuotes: [],
      philosophyNotes: [],
      activeTab: 'reader',

      setShowOriginal: (show) => set({ showOriginal: show }),
      setShowTranslation: (show) => set({ showTranslation: show }),
      setFontSize: (size) => set({ fontSize: size }),
      setHighlightKeywords: (highlight) => set({ highlightKeywords: highlight }),
      setActiveTab: (tab) => set({ activeTab: tab }),

      addAnnotation: (annotation) => {
        const newAnnotation: Annotation = {
          ...annotation,
          id: `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({ annotations: [...get().annotations, newAnnotation] });
      },

      updateAnnotation: (id, text) => {
        set({
          annotations: get().annotations.map((a) =>
            a.id === id ? { ...a, text, updatedAt: Date.now() } : a
          ),
        });
      },

      deleteAnnotation: (id) => {
        set({ annotations: get().annotations.filter((a) => a.id !== id) });
      },

      getAnnotationsByChapter: (bookId, chapterId) => {
        return get().annotations.filter(
          (a) => a.bookId === bookId && a.chapterId === chapterId
        );
      },

      addGoldenQuote: (quote) => {
        const newQuote: GoldenQuote = {
          ...quote,
          id: `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
        };
        set({ goldenQuotes: [...get().goldenQuotes, newQuote] });
      },

      removeGoldenQuote: (id) => {
        set({ goldenQuotes: get().goldenQuotes.filter((q) => q.id !== id) });
      },

      updateGoldenQuoteNote: (id, note) => {
        set({
          goldenQuotes: get().goldenQuotes.map((q) =>
            q.id === id ? { ...q, note } : q
          ),
        });
      },

      isGoldenQuote: (bookId, chapterId, originalText) => {
        return get().goldenQuotes.some(
          (q) =>
            q.bookId === bookId &&
            q.chapterId === chapterId &&
            q.originalText === originalText
        );
      },

      addPhilosophyNote: (note) => {
        const newNote: PhilosophyNote = {
          ...note,
          id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({ philosophyNotes: [...get().philosophyNotes, newNote] });
      },

      updatePhilosophyNote: (id, updates) => {
        set({
          philosophyNotes: get().philosophyNotes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
          ),
        });
      },

      deletePhilosophyNote: (id) => {
        set({ philosophyNotes: get().philosophyNotes.filter((n) => n.id !== id) });
      },
    }),
    {
      name: 'reader-storage',
      partialize: (state) => ({
        showOriginal: state.showOriginal,
        showTranslation: state.showTranslation,
        fontSize: state.fontSize,
        highlightKeywords: state.highlightKeywords,
        annotations: state.annotations,
        goldenQuotes: state.goldenQuotes,
        philosophyNotes: state.philosophyNotes,
      }),
    }
  )
);
