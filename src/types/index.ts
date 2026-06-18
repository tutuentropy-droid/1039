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
  place?: string;
  schoolId: string;
  biography: string;
  description?: string;
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
  startYear: number;
  endYear: number;
}

export const DYNASTY_OPTIONS: DynastyOption[] = [
  { id: 'all', name: '全部', years: '', startYear: -600, endYear: 1600 },
  { id: 'pre-qin', name: '先秦', years: '前221年以前', startYear: -600, endYear: -221 },
  { id: 'han', name: '两汉', years: '前206年-220年', startYear: -206, endYear: 220 },
  { id: 'wei-jin', name: '魏晋', years: '220年-589年', startYear: 220, endYear: 589 },
  { id: 'tang', name: '隋唐', years: '581年-907年', startYear: 581, endYear: 907 },
  { id: 'song-ming', name: '宋明', years: '960年-1644年', startYear: 960, endYear: 1644 },
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

export type MapNodeType = 'birthplace' | 'lecture' | 'event' | 'school';

export interface MapLocation {
  id: string;
  name: string;
  modernName: string;
  province: string;
  lng: number;
  lat: number;
  description: string;
  culturalSignificance: string;
}

export interface MapNode {
  id: string;
  locationId: string;
  type: MapNodeType;
  title: string;
  description: string;
  year: number;
  yearLabel: string;
  philosopherId?: string;
  schoolId?: string;
  eventId?: string;
  relatedIdeas: string[];
}

export const MAP_NODE_TYPE_LABELS: Record<MapNodeType, string> = {
  'birthplace': '出生地',
  'lecture': '讲学地',
  'event': '重要事件',
  'school': '学派中心',
};

export const MAP_NODE_TYPE_COLORS: Record<MapNodeType, string> = {
  'birthplace': '#D97706',
  'lecture': '#4338CA',
  'event': '#7C3AED',
  'school': '#059669',
};

export type GamePhase = 'select' | 'playing' | 'ended';
export type ActionType = 'lecture' | 'debate' | 'persuade' | 'write';
export type RulerAlignment = 'supportive' | 'neutral' | 'opposed';

export interface State {
  influence: Record<string, number>;
  prestige: number;
  disciples: number;
  energy: number;
  maxEnergy: number;
}

export interface SchoolAbility {
  id: string;
  name: string;
  description: string;
  effect: string;
  cooldown: number;
  currentCooldown: number;
}

export interface RulerState {
  id: string;
  alignment: RulerAlignment;
  influence: number;
  adoptedSchoolId: string | null;
}

export interface GameState {
  phase: GamePhase;
  currentTurn: number;
  maxTurns: number;
  playerSchoolId: string | null;
  state: State;
  rulers: Record<string, RulerState>;
  abilities: SchoolAbility[];
  eventLog: GameEvent[];
  selectedRulerId: string | null;
  gameResult: 'victory' | 'defeat' | null;
}

export interface GameEvent {
  id: string;
  turn: number;
  type: 'action' | 'random' | 'system';
  title: string;
  description: string;
  effects: {
    influence?: Record<string, number>;
    prestige?: number;
    disciples?: number;
    energy?: number;
  };
}

export interface Ruler {
  id: string;
  name: string;
  stateName: string;
  locationId: string;
  description: string;
  tendencies: string[];
  power: number;
  startYear: number;
  endYear: number;
}

export interface ActionConfig {
  id: ActionType;
  name: string;
  description: string;
  energyCost: number;
  icon: string;
  baseSuccessRate: number;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  probability: number;
  effects: {
    influence?: Record<string, number>;
    prestige?: number;
    disciples?: number;
    energy?: number;
  };
  choices?: {
    text: string;
    effects: {
      influence?: Record<string, number>;
      prestige?: number;
      disciples?: number;
      energy?: number;
    };
  }[];
}

export interface SchoolGameConfig {
  schoolId: string;
  startingInfluence: Record<string, number>;
  startingPrestige: number;
  startingDisciples: number;
  abilities: Omit<SchoolAbility, 'currentCooldown'>[];
  lectureBonus: number;
  debateBonus: number;
  persuadeBonus: number;
  writeBonus: number;
}

export const ACTION_CONFIGS: Record<ActionType, ActionConfig> = {
  lecture: {
    id: 'lecture',
    name: '讲学',
    description: '在诸侯国讲学，传播思想，增加当地影响力和门徒数量',
    energyCost: 20,
    icon: 'book-open',
    baseSuccessRate: 0.8,
  },
  debate: {
    id: 'debate',
    name: '辩论',
    description: '与其他学派辩论，获胜可大幅增加声望和影响力',
    energyCost: 30,
    icon: 'message-circle',
    baseSuccessRate: 0.6,
  },
  persuade: {
    id: 'persuade',
    name: '游说诸侯',
    description: '游说诸侯国君采纳你的思想，获得官方支持',
    energyCost: 40,
    icon: 'users',
    baseSuccessRate: 0.4,
  },
  write: {
    id: 'write',
    name: '著书立说',
    description: '撰写著作，流传后世，永久增加声望',
    energyCost: 50,
    icon: 'scroll',
    baseSuccessRate: 0.9,
  },
};

export const RULER_ALIGNMENT_LABELS: Record<RulerAlignment, string> = {
  supportive: '支持',
  neutral: '中立',
  opposed: '反对',
};

export const RULER_ALIGNMENT_COLORS: Record<RulerAlignment, string> = {
  supportive: '#059669',
  neutral: '#D97706',
  opposed: '#A52A2A',
};

export interface ClassicChapter {
  id: string;
  title: string;
  chapterNumber: number;
  original: string[];
  translation: string[];
  keywords?: string[];
}

export interface ClassicBook {
  id: string;
  workId: string;
  title: string;
  author: string;
  dynasty: string;
  description: string;
  chapters: ClassicChapter[];
  category: 'confucian' | 'taoist' | 'mohist' | 'legalist' | 'other';
}

export interface Annotation {
  id: string;
  bookId: string;
  chapterId: string;
  lineIndex: number;
  text: string;
  createdAt: number;
  updatedAt: number;
}

export interface GoldenQuote {
  id: string;
  bookId: string;
  chapterId: string;
  originalText: string;
  translationText: string;
  note?: string;
  createdAt: number;
}

export interface PhilosophyNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  relatedBookId?: string;
  relatedQuoteId?: string;
  createdAt: number;
  updatedAt: number;
}
