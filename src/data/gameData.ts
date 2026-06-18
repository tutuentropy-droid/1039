import { Ruler, SchoolGameConfig, RandomEvent, SchoolAbility } from '@/types';

export const rulers: Ruler[] = [
  {
    id: 'qi',
    name: '齐威王',
    stateName: '齐国',
    locationId: 'linzi',
    description: '齐国国君，广开言路，创办稷下学宫，招揽天下贤士。',
    tendencies: ['con', 'learning', 'open'],
    power: 85,
    startYear: -356,
    endYear: -320,
  },
  {
    id: 'qin',
    name: '秦孝公',
    stateName: '秦国',
    locationId: 'xianyang',
    description: '秦国国君，锐意进取，任用商鞅变法，力图富国强兵。',
    tendencies: ['reform', 'legal', 'military'],
    power: 80,
    startYear: -361,
    endYear: -338,
  },
  {
    id: 'wei',
    name: '魏惠王',
    stateName: '魏国',
    locationId: 'daliang',
    description: '魏国国君，雄心勃勃，但在重大决策上常有失误。',
    tendencies: ['tradition', 'military', 'ambitious'],
    power: 75,
    startYear: -369,
    endYear: -319,
  },
  {
    id: 'zhao',
    name: '赵武灵王',
    stateName: '赵国',
    locationId: 'handan',
    description: '赵国国君，推行胡服骑射，改革军制，雄才大略。',
    tendencies: ['reform', 'military', 'practical'],
    power: 70,
    startYear: -325,
    endYear: -299,
  },
  {
    id: 'chu',
    name: '楚宣王',
    stateName: '楚国',
    locationId: 'shangqiu',
    description: '楚国国君，地大物博，文化繁荣，对各种思想兼收并蓄。',
    tendencies: ['culture', 'tao', 'noble'],
    power: 82,
    startYear: -369,
    endYear: -340,
  },
  {
    id: 'yan',
    name: '燕昭王',
    stateName: '燕国',
    locationId: 'zhoukou',
    description: '燕国国君，立志复仇，高筑黄金台，广招天下英才。',
    tendencies: ['talent', 'humble', 'revenge'],
    power: 60,
    startYear: -311,
    endYear: -279,
  },
  {
    id: 'han',
    name: '韩昭侯',
    stateName: '韩国',
    locationId: 'xinzheng',
    description: '韩国国君，任用申不害变法，加强君主集权，国力增强。',
    tendencies: ['legal', 'centralize', 'cautious'],
    power: 55,
    startYear: -362,
    endYear: -333,
  },
];

export const getRulerById = (id: string): Ruler | undefined => {
  return rulers.find(ruler => ruler.id === id);
};

export const schoolGameConfigs: Record<string, SchoolGameConfig> = {
  confucianism: {
    schoolId: 'confucianism',
    startingInfluence: { qi: 30, wei: 20, chu: 15, zhao: 10, yan: 10, han: 10, qin: 5 },
    startingPrestige: 30,
    startingDisciples: 50,
    lectureBonus: 25,
    debateBonus: 15,
    persuadeBonus: 10,
    writeBonus: 20,
    abilities: [
      {
        id: 'ren-zheng',
        name: '仁政德治',
        description: '以仁义道德游说诸侯，大幅提高在支持性诸侯国的影响力',
        effect: '选择一个诸侯国，若其态度为支持，则影响力+40；中立则+20',
        cooldown: 3,
      },
      {
        id: 'jiao-wu-lei',
        name: '有教无类',
        description: '广收门徒，不问出身，快速增加弟子数量',
        effect: '弟子数量+30，同时恢复20点体力',
        cooldown: 2,
      },
    ],
  },
  taoism: {
    schoolId: 'taoism',
    startingInfluence: { chu: 35, qi: 20, wei: 15, zhao: 10, yan: 10, han: 5, qin: 5 },
    startingPrestige: 25,
    startingDisciples: 30,
    lectureBonus: 15,
    debateBonus: 10,
    persuadeBonus: 15,
    writeBonus: 30,
    abilities: [
      {
        id: 'wu-wei',
        name: '无为而治',
        description: '顺应自然，不刻意作为，反而能获得意想不到的效果',
        effect: '所有诸侯国影响力各+10，且下回合体力消耗减半',
        cooldown: 4,
      },
      {
        id: 'xiao-yao',
        name: '逍遥游',
        description: '精神自由，不为外物所累，恢复大量体力',
        effect: '体力恢复至满值，声望+10',
        cooldown: 3,
      },
    ],
  },
  legalism: {
    schoolId: 'legalism',
    startingInfluence: { qin: 40, han: 30, wei: 20, zhao: 15, qi: 10, chu: 5, yan: 5 },
    startingPrestige: 35,
    startingDisciples: 25,
    lectureBonus: 10,
    debateBonus: 25,
    persuadeBonus: 30,
    writeBonus: 15,
    abilities: [
      {
        id: 'fa-bu-a-gui',
        name: '法不阿贵',
        description: '法律面前人人平等，严厉打击贵族特权',
        effect: '选择一个诸侯国，无论态度如何，影响力+35',
        cooldown: 3,
      },
      {
        id: 'ji-quan',
        name: '君主集权',
        description: '加强君主权力，获得诸侯国君的强力支持',
        effect: '选择一个诸侯国，其态度直接变为支持，影响力+25',
        cooldown: 5,
      },
    ],
  },
  mohism: {
    schoolId: 'mohism',
    startingInfluence: { wei: 25, chu: 20, qi: 15, zhao: 15, yan: 15, han: 10, qin: 5 },
    startingPrestige: 20,
    startingDisciples: 40,
    lectureBonus: 20,
    debateBonus: 20,
    persuadeBonus: 20,
    writeBonus: 15,
    abilities: [
      {
        id: 'jian-ai',
        name: '兼爱非攻',
        description: '博爱众生，反对战争，获得民众广泛支持',
        effect: '所有诸侯国影响力各+15，弟子+20',
        cooldown: 3,
      },
      {
        id: 'shou-cheng',
        name: '墨守成规',
        description: '擅长守城之术，为诸侯提供军事防御帮助',
        effect: '选择一个诸侯国，影响力+50',
        cooldown: 4,
      },
    ],
  },
  logicians: {
    schoolId: 'logicians',
    startingInfluence: { wei: 35, zhao: 30, qi: 15, chu: 10, han: 10, yan: 5, qin: 5 },
    startingPrestige: 15,
    startingDisciples: 20,
    lectureBonus: 10,
    debateBonus: 40,
    persuadeBonus: 15,
    writeBonus: 20,
    abilities: [
      {
        id: 'bai-ma-fei-ma',
        name: '白马非马',
        description: '精妙的逻辑辩论，让对手哑口无言',
        effect: '立即进行一次辩论，成功率+30%，若成功声望+25',
        cooldown: 3,
      },
      {
        id: 'ming-shi-bian',
        name: '名实之辨',
        description: '探究名称与实际的关系，揭示事物本质',
        effect: '选择一个诸侯国，使其态度向支持方向转变一级',
        cooldown: 4,
      },
    ],
  },
  'yin-yang': {
    schoolId: 'yin-yang',
    startingInfluence: { qi: 40, yan: 25, chu: 20, wei: 15, han: 15, zhao: 10, qin: 10 },
    startingPrestige: 20,
    startingDisciples: 25,
    lectureBonus: 15,
    debateBonus: 15,
    persuadeBonus: 25,
    writeBonus: 25,
    abilities: [
      {
        id: 'wu-de-zhong-shi',
        name: '五德终始',
        description: '以五行相生相克解释王朝更替，预测天命所归',
        effect: '选择一个诸侯国，若其国力强盛，影响力+45',
        cooldown: 4,
      },
      {
        id: 'tian-ren-gan-ying',
        name: '天人感应',
        description: '观察天象变化，警示诸侯顺应天道',
        effect: '所有态度为反对的诸侯国，其态度转为中立',
        cooldown: 5,
      },
    ],
  },
};

export const getSchoolGameConfig = (schoolId: string): SchoolGameConfig | undefined => {
  return schoolGameConfigs[schoolId];
};

export const randomEvents: RandomEvent[] = [
  {
    id: 'drought',
    title: '大旱三年',
    description: '天下大旱，颗粒无收，百姓流离失所。你如何应对？',
    probability: 0.1,
    effects: {},
    choices: [
      {
        text: '劝说诸侯开仓放粮，救济百姓',
        effects: { prestige: 15, influence: { qi: 10, wei: 10, zhao: 10 } },
      },
      {
        text: '带领弟子帮助灾民，以身作则',
        effects: { disciples: 20, prestige: 10, energy: -20 },
      },
      {
        text: '静观其变，这是天命使然',
        effects: { prestige: -10 },
      },
    ],
  },
  {
    id: 'war-between-states',
    title: '诸侯征战',
    description: '两个诸侯国爆发战争，生灵涂炭。你该如何自处？',
    probability: 0.15,
    effects: {},
    choices: [
      {
        text: '前往游说，劝双方罢兵言和',
        effects: { prestige: 20, energy: -30, influence: { wei: 15, zhao: 15 } },
      },
      {
        text: '发表声明，谴责战争暴行',
        effects: { prestige: 10, influence: { yan: 10, han: 10 } },
      },
      {
        text: '隐居山林，不问世事',
        effects: { energy: 20, prestige: -5 },
      },
    ],
  },
  {
    id: 'emperor-invitation',
    title: '诸侯相邀',
    description: '一位诸侯派遣使者前来，邀请你前往讲学。',
    probability: 0.12,
    effects: {},
    choices: [
      {
        text: '欣然前往，借机传播思想',
        effects: { influence: { qi: 25 }, energy: -15, prestige: 10 },
      },
      {
        text: '婉言谢绝，专心著书',
        effects: { prestige: 15, disciples: -10 },
      },
      {
        text: '派弟子前往代为讲学',
        effects: { influence: { qi: 15 }, disciples: 10 },
      },
    ],
  },
  {
    id: 'scholar-debate',
    title: '高士来访',
    description: '一位其他学派的著名学者前来拜访，希望与你辩论。',
    probability: 0.15,
    effects: {},
    choices: [
      {
        text: '欣然应战，以理服人',
        effects: { prestige: 25, energy: -20 },
      },
      {
        text: '以和为贵，交流为主',
        effects: { prestige: 10, influence: { wei: 10, qi: 10 } },
      },
      {
        text: '称病不见，避免冲突',
        effects: { prestige: -15, disciples: -5 },
      },
    ],
  },
  {
    id: 'disciples-betrayal',
    title: '门徒离去',
    description: '几名核心弟子对你的学说产生怀疑，想要离开。',
    probability: 0.08,
    effects: {},
    choices: [
      {
        text: '坦诚交流，解答疑惑',
        effects: { disciples: 10, prestige: 5, energy: -10 },
      },
      {
        text: '好聚好散，不强留',
        effects: { disciples: -10, prestige: -5 },
      },
      {
        text: '严厉斥责，清理门户',
        effects: { disciples: -20, prestige: 5 },
      },
    ],
  },
  {
    id: 'natural-disaster',
    title: '地震山崩',
    description: '某地发生大地震，山崩地裂，死伤无数。',
    probability: 0.08,
    effects: {},
    choices: [
      {
        text: '这是上天示警，需修德政',
        effects: { influence: { yan: 20, han: 15 }, prestige: 10 },
      },
      {
        text: '组织救援，安顿灾民',
        effects: { disciples: 15, prestige: 15, energy: -25 },
      },
      {
        text: '天行有常，不为尧存，不为桀亡',
        effects: { prestige: 5, influence: { qin: 15 } },
      },
    ],
  },
  {
    id: 'new-book',
    title: '奇书现世',
    description: '有人献上一部上古奇书，据说其中蕴含高深智慧。',
    probability: 0.1,
    effects: {},
    choices: [
      {
        text: '潜心研读，融会贯通',
        effects: { prestige: 20, energy: -20 },
      },
      {
        text: '收藏起来，秘不示人',
        effects: { prestige: 5, disciples: -10 },
      },
      {
        text: '公开刻印，广传天下',
        effects: { prestige: 15, influence: { qi: 10, wei: 10, chu: 10 } },
      },
    ],
  },
  {
    id: 'palace-coup',
    title: '宫廷政变',
    description: '某国发生政变，国君被废，新君即位。',
    probability: 0.08,
    effects: {},
    choices: [
      {
        text: '承认新君，观察其为政',
        effects: { influence: { zhao: 15 }, prestige: 5 },
      },
      {
        text: '谴责篡位，号召勤王',
        effects: { influence: { zhao: -20 }, prestige: 15 },
      },
      {
        text: '不偏不倚，保持中立',
        effects: { prestige: -5 },
      },
    ],
  },
];

export const getRandomEvent = (): RandomEvent | null => {
  const roll = Math.random();
  let cumulative = 0;
  for (const event of randomEvents) {
    cumulative += event.probability;
    if (roll < cumulative) {
      return { ...event };
    }
  }
  return null;
};

export const getDefaultSchoolAbilities = (schoolId: string): SchoolAbility[] => {
  const config = schoolGameConfigs[schoolId];
  if (!config) return [];
  return config.abilities.map((ability, index) => ({
    ...ability,
    id: `${schoolId}-ability-${index}`,
    currentCooldown: 0,
  }));
};
