import { create } from 'zustand';
import { DynastyPeriod, School, Philosopher, Relation } from '@/types';
import { dataService } from '@/services/dataService';

interface AppState {
  selectedPeriod: DynastyPeriod;
  searchTerm: string;
  selectedSchool: School | null;
  selectedPhilosopher: Philosopher | null;
  highlightedRelations: string[];
  pathStartId: string | null;
  pathEndId: string | null;
  currentPath: Relation[] | null;

  setSelectedPeriod: (period: DynastyPeriod) => void;
  setSearchTerm: (term: string) => void;
  setSelectedSchool: (school: School | null) => void;
  setSelectedPhilosopher: (philosopher: Philosopher | null) => void;
  setHighlightedRelations: (relationIds: string[]) => void;
  setPathStart: (id: string | null) => void;
  setPathEnd: (id: string | null) => void;
  calculatePath: () => void;
  clearPath: () => void;
  clearSelection: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  selectedPeriod: 'all',
  searchTerm: '',
  selectedSchool: null,
  selectedPhilosopher: null,
  highlightedRelations: [],
  pathStartId: null,
  pathEndId: null,
  currentPath: null,

  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedSchool: (school) => set({ selectedSchool: school, selectedPhilosopher: null }),
  setSelectedPhilosopher: (philosopher) => set({ selectedPhilosopher: philosopher, selectedSchool: null }),
  setHighlightedRelations: (relationIds) => set({ highlightedRelations: relationIds }),

  setPathStart: (id) => {
    if (id === get().pathEndId) {
      set({ pathEndId: null });
    }
    set({ pathStartId: id });
  },

  setPathEnd: (id) => {
    if (id === get().pathStartId) {
      set({ pathStartId: null });
    }
    set({ pathEndId: id });
  },

  calculatePath: () => {
    const { pathStartId, pathEndId } = get();
    if (pathStartId && pathEndId) {
      const path = dataService.getPathBetweenEntities(pathStartId, pathEndId);
      set({ currentPath: path });
      if (path) {
        set({ highlightedRelations: path.map(r => r.id) });
      }
    }
  },

  clearPath: () => set({
    pathStartId: null,
    pathEndId: null,
    currentPath: null,
    highlightedRelations: [],
  }),

  clearSelection: () => set({
    selectedSchool: null,
    selectedPhilosopher: null,
    highlightedRelations: [],
  }),
}));
