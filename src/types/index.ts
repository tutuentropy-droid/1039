export interface School {
  id: string;
  name: string;
  period: string;
  dynasty: string;
  description: string;
  coreIdeas: string[];
  color: string;
  icon: string;
  positionX: number;
  positionY: number;
  parentId?: string;
  branchFrom?: string;
}

export interface Philosopher {
  id: string;
  name: string;
  birthYear: string;
  deathYear: string;
  dynasty: string;
  schoolId: string;
  biography: string;
  coreIdeas: string[];
  works: string[];
  imageUrl: string;
}

export interface Work {
  id: string;
  title: string;
  authorId: string;
  schoolId: string;
  year: string;
  description: string;
}

export type RelationType = 'inheritance' | 'influence' | 'opposition' | 'teacher-student';
export type EntityType = 'school' | 'philosopher';

export interface Relation {
  id: string;
  sourceId: string;
  sourceType: EntityType;
  targetId: string;
  targetType: EntityType;
  relationType: RelationType;
  description: string;
  strength: number;
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  schoolId?: string;
  philosopherId?: string;
}

export type DynastyPeriod = 'all' | 'pre-qin' | 'han' | 'wei-jin' | 'tang' | 'song-ming';

export interface DynastyOption {
  id: DynastyPeriod;
  name: string;
  years: string;
}

export const DYNASTY_OPTIONS: DynastyOption[] = [
  { id: 'all', name: '全部', years: '' },
  { id: 'pre-qin', name: '先秦', years: '前221年以前' },
  { id: 'han', name: '两汉', years: '前206年-220年' },
  { id: 'wei-jin', name: '魏晋', years: '220年-589年' },
  { id: 'tang', name: '隋唐', years: '581年-907年' },
  { id: 'song-ming', name: '宋明', years: '960年-1644年' },
];

export const RELATION_TYPE_LABELS: Record<RelationType, string> = {
  'inheritance': '传承',
  'influence': '影响',
  'opposition': '对立',
  'teacher-student': '师承',
};

export const RELATION_TYPE_COLORS: Record<RelationType, string> = {
  'inheritance': '#8B4513',
  'influence': '#1E4D6B',
  'opposition': '#A52A2A',
  'teacher-student': '#2E7D32',
};
