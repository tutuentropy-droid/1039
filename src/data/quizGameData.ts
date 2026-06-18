import {
  QuizQuestion,
  MatchingGameData,
  CategorizationGameData,
  UnlockableItem,
  GameLevel,
} from '@/types';

export const GAME_LEVELS: GameLevel[] = [
  { level: 1, name: '初学童子', expRequired: 0, color: '#9CA3AF' },
  { level: 2, name: '入门书生', expRequired: 100, color: '#6B7280' },
  { level: 3, name: '问道学子', expRequired: 300, color: '#F59E0B' },
  { level: 4, name: '修身雅士', expRequired: 600, color: '#10B981' },
  { level: 5, name: '齐家贤士', expRequired: 1000, color: '#3B82F6' },
  { level: 6, name: '治国能臣', expRequired: 1500, color: '#8B5CF6' },
  { level: 7, name: '平天下者', expRequired: 2100, color: '#EC4899' },
  { level: 8, name: '一代宗师', expRequired: 2800, color: '#EF4444' },
  { level: 9, name: '百世之师', expRequired: 3600, color: '#F97316' },
  { level: 10, name: '千古圣贤', expRequired: 4500, color: '#8B4513' },
];

export const getLevelInfo = (exp: number): { level: GameLevel; currentLevelExp: number; nextLevelExp: number; progress: number } => {
  for (let i = GAME_LEVELS.length - 1; i >= 0; i--) {
    if (exp >= GAME_LEVELS[i].expRequired) {
      const currentLevel = GAME_LEVELS[i];
      const nextLevel = GAME_LEVELS[i + 1] || GAME_LEVELS[i];
      const currentLevelExp = currentLevel.expRequired;
      const nextLevelExp = nextLevel.expRequired;
      const progress = nextLevelExp === currentLevelExp
        ? 100
        : Math.min(100, ((exp - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100);
      return { level: currentLevel, currentLevelExp, nextLevelExp, progress };
    }
  }
  return { level: GAME_LEVELS[0], currentLevelExp: 0, nextLevelExp: GAME_LEVELS[1]?.expRequired || 100, progress: 0 };
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'single',
    question: '儒家学派的创始人是谁？',
    options: ['老子', '孔子', '墨子', '韩非子'],
    correctAnswers: [1],
    explanation: '孔子（公元前551年-公元前479年），名丘，字仲尼，是儒家学派的创始人，被后世尊称为"至圣先师"。',
    difficulty: 'easy',
    schoolId: 'confucianism',
    philosopherId: 'confucius',
    expReward: 10,
  },
  {
    id: 'q2',
    type: 'single',
    question: '道家学派的核心概念是什么？',
    options: ['仁', '法', '道', '兼爱'],
    correctAnswers: [2],
    explanation: '道家以"道"为核心概念，认为道是宇宙的本原和万物运行的规律，主张道法自然、无为而治。',
    difficulty: 'easy',
    schoolId: 'taoism',
    expReward: 10,
  },
  {
    id: 'q3',
    type: 'single',
    question: '墨家主张的核心思想是？',
    options: ['克己复礼', '兼爱非攻', '无为而治', '以法治国'],
    correctAnswers: [1],
    explanation: '墨家由墨子创立，主张"兼相爱，交相利"，提倡兼爱、非攻、尚贤、节用等思想。',
    difficulty: 'easy',
    schoolId: 'mohism',
    expReward: 10,
  },
  {
    id: 'q4',
    type: 'single',
    question: '法家思想的集大成者是谁？',
    options: ['商鞅', '申不害', '韩非子', '李斯'],
    correctAnswers: [2],
    explanation: '韩非子是法家思想的集大成者，他将商鞅的"法"、申不害的"术"和慎到的"势"融为一体，形成了完整的法家理论体系。',
    difficulty: 'easy',
    schoolId: 'legalism',
    philosopherId: 'hanfei',
    expReward: 10,
  },
  {
    id: 'q5',
    type: 'truefalse',
    question: '"性善论"是孟子提出的观点。',
    options: ['正确', '错误'],
    correctAnswers: [0],
    explanation: '孟子提出"性善论"，认为人性本善，人皆有恻隐之心、羞恶之心、恭敬之心、是非之心。',
    difficulty: 'easy',
    philosopherId: 'mencius',
    expReward: 10,
  },
  {
    id: 'q6',
    type: 'single',
    question: '"白马非马"的著名辩题是由谁提出的？',
    options: ['惠施', '公孙龙', '庄子', '墨子'],
    correctAnswers: [1],
    explanation: '"白马非马"是名家代表人物公孙龙提出的著名逻辑命题，探讨了"名"与"实"的关系。',
    difficulty: 'medium',
    schoolId: 'logicians',
    expReward: 20,
  },
  {
    id: 'q7',
    type: 'multiple',
    question: '以下哪些是儒家的核心思想？（多选）',
    options: ['仁', '无为', '礼', '兼爱', '中庸'],
    correctAnswers: [0, 2, 4],
    explanation: '儒家的核心思想包括仁、义、礼、智、信、中庸等。无为是道家思想，兼爱是墨家思想。',
    difficulty: 'medium',
    schoolId: 'confucianism',
    expReward: 20,
  },
  {
    id: 'q8',
    type: 'single',
    question: '《道德经》的作者是谁？',
    options: ['孔子', '孟子', '老子', '庄子'],
    correctAnswers: [2],
    explanation: '《道德经》又称《老子》，是道家学派创始人老子的著作，是中国历史上最重要的哲学经典之一。',
    difficulty: 'easy',
    schoolId: 'taoism',
    philosopherId: 'laozi',
    expReward: 10,
  },
  {
    id: 'q9',
    type: 'single',
    question: '荀子在人性问题上的主张是？',
    options: ['性善论', '性恶论', '性无善无恶', '性三品说'],
    correctAnswers: [1],
    explanation: '荀子提出"性恶论"，认为人的本性是恶的，需要通过后天的教化和学习来使人向善。',
    difficulty: 'easy',
    philosopherId: 'xunzi',
    expReward: 10,
  },
  {
    id: 'q10',
    type: 'truefalse',
    question: '庄子的思想比老子更积极入世。',
    options: ['正确', '错误'],
    correctAnswers: [1],
    explanation: '庄子的思想比老子更加追求精神上的逍遥自在，强调个体精神的自由解放，更加避世而非入世。',
    difficulty: 'medium',
    schoolId: 'taoism',
    philosopherId: 'zhuangzi',
    expReward: 20,
  },
  {
    id: 'q11',
    type: 'single',
    question: '"五德终始"说是由哪个学派提出的？',
    options: ['儒家', '道家', '阴阳家', '法家'],
    correctAnswers: [2],
    explanation: '"五德终始"说是阴阳家代表人物邹衍提出的，用五行相生相克的理论来解释王朝的更替。',
    difficulty: 'medium',
    schoolId: 'yin-yang',
    expReward: 20,
  },
  {
    id: 'q12',
    type: 'multiple',
    question: '以下哪些属于法家的主张？（多选）',
    options: ['以法治国', '仁政德治', '君主集权', '赏罚分明', '兼爱非攻'],
    correctAnswers: [0, 2, 3],
    explanation: '法家主张以法治国、君主集权、赏罚分明、奖励耕战等。仁政德治是儒家思想，兼爱非攻是墨家思想。',
    difficulty: 'medium',
    schoolId: 'legalism',
    expReward: 20,
  },
  {
    id: 'q13',
    type: 'single',
    question: '"民为贵，社稷次之，君为轻"是谁的名言？',
    options: ['孔子', '孟子', '荀子', '老子'],
    correctAnswers: [1],
    explanation: '这句话出自《孟子·尽心下》，体现了孟子的民本思想，认为人民是最重要的，国家其次，君主最轻。',
    difficulty: 'medium',
    philosopherId: 'mencius',
    expReward: 20,
  },
  {
    id: 'q14',
    type: 'single',
    question: '墨家在自然科学方面的贡献不包括以下哪项？',
    options: ['小孔成像', '杠杆原理', '勾股定理', '浮力原理'],
    correctAnswers: [3],
    explanation: '墨家在逻辑学、几何学、光学等方面有重要贡献，包括小孔成像、杠杆原理、勾股定理等。浮力原理是阿基米德发现的。',
    difficulty: 'hard',
    schoolId: 'mohism',
    expReward: 30,
  },
  {
    id: 'q15',
    type: 'truefalse',
    question: '"天行有常，不为尧存，不为桀亡"是荀子的观点。',
    options: ['正确', '错误'],
    correctAnswers: [0],
    explanation: '这句话出自《荀子·天论》，体现了荀子的唯物主义自然观，认为自然有其运行规律，不以人的意志为转移。',
    difficulty: 'medium',
    philosopherId: 'xunzi',
    expReward: 20,
  },
  {
    id: 'q16',
    type: 'single',
    question: '"逍遥游"的思想境界是由谁提出的？',
    options: ['老子', '庄子', '列子', '杨朱'],
    correctAnswers: [1],
    explanation: '"逍遥游"是庄子思想的核心概念之一，描述了一种不受任何束缚、绝对自由的精神境界。',
    difficulty: 'easy',
    philosopherId: 'zhuangzi',
    expReward: 10,
  },
  {
    id: 'q17',
    type: 'multiple',
    question: '以下哪些是孔子的弟子？（多选）',
    options: ['颜回', '子路', '孟子', '子贡', '荀子'],
    correctAnswers: [0, 1, 3],
    explanation: '颜回、子路、子贡都是孔子的著名弟子。孟子和荀子是孔子之后儒家学派的代表人物，但不是孔子的直接弟子。',
    difficulty: 'medium',
    philosopherId: 'confucius',
    expReward: 20,
  },
  {
    id: 'q18',
    type: 'single',
    question: '商鞅变法主要发生在哪个国家？',
    options: ['齐国', '楚国', '秦国', '魏国'],
    correctAnswers: [2],
    explanation: '商鞅在秦国主持变法，使秦国国力大增，为后来秦始皇统一六国奠定了基础。',
    difficulty: 'easy',
    schoolId: 'legalism',
    philosopherId: 'shangyang',
    expReward: 10,
  },
  {
    id: 'q19',
    type: 'single',
    question: '"己所不欲，勿施于人"体现了儒家的什么思想？',
    options: ['仁', '礼', '忠', '恕'],
    correctAnswers: [3],
    explanation: '"己所不欲，勿施于人"是孔子对"恕"的解释，意思是自己不愿意的，不要强加给别人，是儒家"仁"的思想在人际交往中的体现。',
    difficulty: 'medium',
    philosopherId: 'confucius',
    expReward: 20,
  },
  {
    id: 'q20',
    type: 'single',
    question: '以下哪一项不是老子辩证法思想的体现？',
    options: ['有无相生', '祸福相倚', '刚柔并济', '物极必反'],
    correctAnswers: [2],
    explanation: '老子的辩证法思想包括有无相生、难易相成、长短相形、祸福相倚、物极必反等。刚柔并济是后世对道家思想的发展，不是老子直接提出的。',
    difficulty: 'hard',
    philosopherId: 'laozi',
    expReward: 30,
  },
];

export const getRandomQuestions = (count: number, difficulty?: string, schoolId?: string): QuizQuestion[] => {
  let filtered = [...quizQuestions];
  
  if (difficulty) {
    filtered = filtered.filter(q => q.difficulty === difficulty);
  }
  if (schoolId) {
    filtered = filtered.filter(q => q.schoolId === schoolId);
  }
  
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const matchingGames: MatchingGameData[] = [
  {
    id: 'm1',
    title: '哲学家与流派配对',
    description: '将左侧的哲学家与他们所属的思想流派连接起来',
    difficulty: 'easy',
    expReward: 20,
    pairs: [
      { id: 'p1', left: '孔子', right: '儒家', leftType: 'philosopher', rightType: 'school' },
      { id: 'p2', left: '老子', right: '道家', leftType: 'philosopher', rightType: 'school' },
      { id: 'p3', left: '墨子', right: '墨家', leftType: 'philosopher', rightType: 'school' },
      { id: 'p4', left: '韩非子', right: '法家', leftType: 'philosopher', rightType: 'school' },
      { id: 'p5', left: '公孙龙', right: '名家', leftType: 'philosopher', rightType: 'school' },
      { id: 'p6', left: '邹衍', right: '阴阳家', leftType: 'philosopher', rightType: 'school' },
    ],
  },
  {
    id: 'm2',
    title: '思想主张与流派配对',
    description: '将左侧的思想主张与对应的流派连接起来',
    difficulty: 'medium',
    expReward: 30,
    pairs: [
      { id: 'p1', left: '仁政德治', right: '儒家', leftType: 'idea', rightType: 'school' },
      { id: 'p2', left: '无为而治', right: '道家', leftType: 'idea', rightType: 'school' },
      { id: 'p3', left: '兼爱非攻', right: '墨家', leftType: 'idea', rightType: 'school' },
      { id: 'p4', left: '以法治国', right: '法家', leftType: 'idea', rightType: 'school' },
      { id: 'p5', left: '名实之辨', right: '名家', leftType: 'idea', rightType: 'school' },
      { id: 'p6', left: '五德终始', right: '阴阳家', leftType: 'idea', rightType: 'school' },
    ],
  },
  {
    id: 'm3',
    title: '著作与作者配对',
    description: '将左侧的经典著作与它们的作者连接起来',
    difficulty: 'easy',
    expReward: 20,
    pairs: [
      { id: 'p1', left: '《论语》', right: '孔子', leftType: 'work', rightType: 'philosopher' },
      { id: 'p2', left: '《道德经》', right: '老子', leftType: 'work', rightType: 'philosopher' },
      { id: 'p3', left: '《孟子》', right: '孟子', leftType: 'work', rightType: 'philosopher' },
      { id: 'p4', left: '《庄子》', right: '庄子', leftType: 'work', rightType: 'philosopher' },
      { id: 'p5', left: '《韩非子》', right: '韩非子', leftType: 'work', rightType: 'philosopher' },
      { id: 'p6', left: '《墨子》', right: '墨子', leftType: 'work', rightType: 'philosopher' },
    ],
  },
  {
    id: 'm4',
    title: '核心概念与哲学家配对',
    description: '将左侧的核心思想与提出该思想的哲学家连接起来',
    difficulty: 'hard',
    expReward: 40,
    pairs: [
      { id: 'p1', left: '性善论', right: '孟子', leftType: 'idea', rightType: 'philosopher' },
      { id: 'p2', left: '性恶论', right: '荀子', leftType: 'idea', rightType: 'philosopher' },
      { id: 'p3', left: '逍遥游', right: '庄子', leftType: 'idea', rightType: 'philosopher' },
      { id: 'p4', left: '白马非马', right: '公孙龙', leftType: 'idea', rightType: 'philosopher' },
      { id: 'p5', left: '民贵君轻', right: '孟子', leftType: 'idea', rightType: 'philosopher' },
      { id: 'p6', left: '制天命而用之', right: '荀子', leftType: 'idea', rightType: 'philosopher' },
    ],
  },
];

export const getRandomMatchingGame = (difficulty?: string): MatchingGameData | null => {
  let filtered = [...matchingGames];
  
  if (difficulty) {
    filtered = filtered.filter(g => g.difficulty === difficulty);
  }
  
  if (filtered.length === 0) return null;
  
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled[0];
};

export const categorizationGames: CategorizationGameData[] = [
  {
    id: 'c1',
    title: '诸子百家流派归类',
    description: '将下列人物或思想归入正确的流派',
    difficulty: 'easy',
    expReward: 20,
    categories: [
      { id: 'confucianism', name: '儒家' },
      { id: 'taoism', name: '道家' },
      { id: 'legalism', name: '法家' },
      { id: 'mohism', name: '墨家' },
    ],
    items: [
      { id: 'i1', text: '孔子', correctCategory: 'confucianism', philosopherId: 'confucius' },
      { id: 'i2', text: '老子', correctCategory: 'taoism', philosopherId: 'laozi' },
      { id: 'i3', text: '韩非子', correctCategory: 'legalism', philosopherId: 'hanfei' },
      { id: 'i4', text: '墨子', correctCategory: 'mohism', philosopherId: 'mozi' },
      { id: 'i5', text: '孟子', correctCategory: 'confucianism', philosopherId: 'mencius' },
      { id: 'i6', text: '庄子', correctCategory: 'taoism', philosopherId: 'zhuangzi' },
      { id: 'i7', text: '商鞅', correctCategory: 'legalism', philosopherId: 'shangyang' },
      { id: 'i8', text: '兼爱非攻', correctCategory: 'mohism' },
      { id: 'i9', text: '仁', correctCategory: 'confucianism' },
      { id: 'i10', text: '无为', correctCategory: 'taoism' },
      { id: 'i11', text: '法治', correctCategory: 'legalism' },
      { id: 'i12', text: '荀子', correctCategory: 'confucianism', philosopherId: 'xunzi' },
    ],
  },
  {
    id: 'c2',
    title: '儒家经典归类',
    description: '将下列经典归入"四书"或"五经"',
    difficulty: 'medium',
    expReward: 30,
    categories: [
      { id: 'four-books', name: '四书' },
      { id: 'five-classics', name: '五经' },
    ],
    items: [
      { id: 'i1', text: '《论语》', correctCategory: 'four-books' },
      { id: 'i2', text: '《孟子》', correctCategory: 'four-books' },
      { id: 'i3', text: '《大学》', correctCategory: 'four-books' },
      { id: 'i4', text: '《中庸》', correctCategory: 'four-books' },
      { id: 'i5', text: '《诗经》', correctCategory: 'five-classics' },
      { id: 'i6', text: '《尚书》', correctCategory: 'five-classics' },
      { id: 'i7', text: '《礼记》', correctCategory: 'five-classics' },
      { id: 'i8', text: '《周易》', correctCategory: 'five-classics' },
      { id: 'i9', text: '《春秋》', correctCategory: 'five-classics' },
      { id: 'i10', text: '《道德经》', correctCategory: 'none' },
    ],
  },
  {
    id: 'c3',
    title: '思想主张归类',
    description: '将下列主张按其所属流派归类',
    difficulty: 'hard',
    expReward: 40,
    categories: [
      { id: 'confucianism', name: '儒家' },
      { id: 'taoism', name: '道家' },
      { id: 'legalism', name: '法家' },
      { id: 'mohism', name: '墨家' },
      { id: 'logicians', name: '名家' },
      { id: 'yin-yang', name: '阴阳家' },
    ],
    items: [
      { id: 'i1', text: '克己复礼', correctCategory: 'confucianism' },
      { id: 'i2', text: '道法自然', correctCategory: 'taoism' },
      { id: 'i3', text: '法不阿贵', correctCategory: 'legalism' },
      { id: 'i4', text: '尚贤节用', correctCategory: 'mohism' },
      { id: 'i5', text: '离坚白', correctCategory: 'logicians' },
      { id: 'i6', text: '五德终始', correctCategory: 'yin-yang' },
      { id: 'i7', text: '民贵君轻', correctCategory: 'confucianism' },
      { id: 'i8', text: '逍遥游', correctCategory: 'taoism' },
      { id: 'i9', text: '术势结合', correctCategory: 'legalism' },
      { id: 'i10', text: '天志明鬼', correctCategory: 'mohism' },
      { id: 'i11', text: '白马非马', correctCategory: 'logicians' },
      { id: 'i12', text: '天人感应', correctCategory: 'yin-yang' },
    ],
  },
];

export const getRandomCategorizationGame = (difficulty?: string): CategorizationGameData | null => {
  let filtered = [...categorizationGames];
  
  if (difficulty) {
    filtered = filtered.filter(g => g.difficulty === difficulty);
  }
  
  if (filtered.length === 0) return null;
  
  const shuffled = filtered.sort(() => Math.random() - 0.5);
  return shuffled[0];
};

export const unlockablePhilosophers: UnlockableItem[] = [
  { id: 'up-confucius', type: 'philosopher', refId: 'confucius', name: '孔子', description: '儒家学派创始人，至圣先师', unlockLevel: 1 },
  { id: 'up-laozi', type: 'philosopher', refId: 'laozi', name: '老子', description: '道家学派创始人，著《道德经》', unlockLevel: 2 },
  { id: 'up-mozi', type: 'philosopher', refId: 'mozi', name: '墨子', description: '墨家学派创始人，兼爱非攻', unlockLevel: 2 },
  { id: 'up-mencius', type: 'philosopher', refId: 'mencius', name: '孟子', description: '亚圣，性善论提出者', unlockLevel: 3 },
  { id: 'up-zhuangzi', type: 'philosopher', refId: 'zhuangzi', name: '庄子', description: '道家代表，逍遥游', unlockLevel: 3 },
  { id: 'up-hanfei', type: 'philosopher', refId: 'hanfei', name: '韩非子', description: '法家思想集大成者', unlockLevel: 4 },
  { id: 'up-xunzi', type: 'philosopher', refId: 'xunzi', name: '荀子', description: '儒家代表，性恶论', unlockLevel: 4 },
  { id: 'up-shangyang', type: 'philosopher', refId: 'shangyang', name: '商鞅', description: '法家改革家，商鞅变法', unlockLevel: 5 },
];

export const unlockableEvents: UnlockableItem[] = [
  { id: 'ue1', type: 'event', refId: 'event-baijia', name: '百家争鸣', description: '春秋战国时期思想大繁荣', unlockLevel: 1 },
  { id: 'ue2', type: 'event', refId: 'event-jixia', name: '稷下学宫', description: '齐国创办的最早官办高等学府', unlockLevel: 3 },
  { id: 'ue3', type: 'event', refId: 'event-shangyang', name: '商鞅变法', description: '秦国变法图强的重要改革', unlockLevel: 4 },
  { id: 'ue4', type: 'event', refId: 'event-huanglao', name: '黄老之治', description: '汉初无为而治的盛世', unlockLevel: 5 },
  { id: 'ue5', type: 'event', refId: 'event-duzun', name: '罢黜百家独尊儒术', description: '汉武帝时期儒家正统地位确立', unlockLevel: 6 },
];

export const getUnlockableItems = (level: number): UnlockableItem[] => {
  const allItems = [...unlockablePhilosophers, ...unlockableEvents];
  return allItems.filter(item => item.unlockLevel <= level);
};

export const getNewUnlocks = (oldLevel: number, newLevel: number): UnlockableItem[] => {
  const allItems = [...unlockablePhilosophers, ...unlockableEvents];
  return allItems.filter(item => item.unlockLevel > oldLevel && item.unlockLevel <= newLevel);
};
