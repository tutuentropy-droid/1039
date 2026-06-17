import { Work } from '@/types';

export const works: Work[] = [
  {
    id: 'analects',
    title: '《论语》',
    authorId: 'confucius',
    schoolId: 'confucianism',
    year: '约前479年',
    description: '孔子及其弟子的言行录，由孔子弟子及再传弟子编纂而成。全书共20篇、492章，首创"语录体"。记录了孔子与弟子之间的问答，集中体现了孔子的政治主张、伦理思想、道德观念及教育原则等。',
  },
  {
    id: 'mencius-book',
    title: '《孟子》',
    authorId: 'mencius',
    schoolId: 'confucianism',
    year: '约前289年',
    description: '孟子及其弟子万章、公孙丑等著，共七篇。书中记载了孟子与其他诸家思想的争辩，对弟子的言传身教，游说诸侯等内容，集中体现了孟子的政治思想、哲学思想和教育思想。',
  },
  {
    id: 'xunzi-book',
    title: '《荀子》',
    authorId: 'xunzi',
    schoolId: 'confucianism',
    year: '约前238年',
    description: '荀子的著作，共32篇。该书集先秦诸子之大成，内容涉及哲学、政治、经济、军事、教育、文学艺术等各个方面。荀子主张性恶论，强调后天学习和环境的重要性。',
  },
  {
    id: 'daodejing',
    title: '《道德经》',
    authorId: 'laozi',
    schoolId: 'taoism',
    year: '约前5世纪',
    description: '又称《老子》，老子的哲学作品，共81章，分为上下两篇。该书以"道"解释宇宙万物的演变，提出了"道法自然"、"无为而治"等重要思想，是道家哲学思想的重要来源。',
  },
  {
    id: 'zhuangzi-book',
    title: '《庄子》',
    authorId: 'zhuangzi',
    schoolId: 'taoism',
    year: '约前3世纪',
    description: '庄子及其后学的著作集，现存33篇，分为内篇、外篇、杂篇三部分。该书语言汪洋恣肆，想象丰富，通过寓言故事表达哲学思想，集中体现了庄子的相对主义、自然主义和追求精神自由的思想。',
  },
  {
    id: 'hanfeizi-book',
    title: '《韩非子》',
    authorId: 'hanfei',
    schoolId: 'legalism',
    year: '约前233年',
    description: '韩非子的著作集，共55篇。该书集法家思想之大成，系统阐述了韩非子的法治思想，主张法、术、势相结合，建立了完整的君主专制理论体系，为秦统一六国提供了理论基础。',
  },
  {
    id: 'shangjunshu',
    title: '《商君书》',
    authorId: 'shangyang',
    schoolId: 'legalism',
    year: '约前338年',
    description: '又称《商子》，是商鞅及其后学的著作汇编，现存26篇。该书主张变法革新，提出了"治世不一道，便国不法古"的著名论断，阐述了法家的法治思想和改革主张。',
  },
  {
    id: 'mozi-book',
    title: '《墨子》',
    authorId: 'mozi',
    schoolId: 'mohism',
    year: '约前4世纪',
    description: '墨子及其弟子的著作汇编，现存53篇。该书集中体现了墨家的思想主张，包括兼爱、非攻、尚贤、尚同、节用、节葬等重要观点，同时也包含了墨家在逻辑学、自然科学方面的重要贡献。',
  },
  {
    id: 'gongsunlongzi',
    title: '《公孙龙子》',
    authorId: 'gongsunlong',
    schoolId: 'logicians',
    year: '约前3世纪',
    description: '名家代表人物公孙龙的著作，现存6篇。该书以辩论名实问题为中心，提出了"白马非马"、"离坚白"等著名哲学命题，对中国古代逻辑学的发展有重要贡献。',
  },
  {
    id: 'chunqiu-fanlu',
    title: '《春秋繁露》',
    authorId: 'dongzhongshu',
    schoolId: 'han-confucianism',
    year: '约前104年',
    description: '董仲舒的政治哲学著作，共17卷、82篇。该书以儒家宗法思想为中心，杂以阴阳五行学说，系统阐述了"天人感应"、"大一统"、"三纲五常"等重要思想，建立了神学化的儒学体系。',
  },
  {
    id: 'zhouyi-zhu',
    title: '《周易注》',
    authorId: 'wangbi',
    schoolId: 'xuan-xue',
    year: '约249年',
    description: '王弼对《周易》的注释，共10卷。该书摒弃汉代象数之学，以老庄玄学思想解《易》，提出了"得意忘言"的解《易》原则，是魏晋玄学的重要代表作。',
  },
  {
    id: 'liuzu-tanjing',
    title: '《六祖坛经》',
    authorId: 'huineng',
    schoolId: 'buddhism',
    year: '约713年',
    description: '又称《坛经》，是禅宗六祖慧能的语录，由其弟子法海集录。该书系统阐述了慧能的禅宗思想，主张"明心见性"、"顿悟成佛"，是中国佛教著作中唯一被尊称为"经"的典籍。',
  },
  {
    id: 'sishu-zhangju',
    title: '《四书章句集注》',
    authorId: 'zhuxi',
    schoolId: 'neo-confucianism',
    year: '约1190年',
    description: '朱熹对《大学》《中庸》《论语》《孟子》的注释，共26卷。该书系统阐发了朱熹的理学思想，成为明清两代科举考试的官方指定教材，对中国封建社会后期的思想文化产生了深远影响。',
  },
  {
    id: 'jin-si-lu',
    title: '《近思录》',
    authorId: 'zhuxi',
    schoolId: 'neo-confucianism',
    year: '约1175年',
    description: '朱熹与吕祖谦合编，共14卷。该书选编了周敦颐、程颢、程颐、张载的语录622条，系统展示了宋代理学的思想体系，是理学入门的重要典籍。',
  },
  {
    id: 'chuanxilu',
    title: '《传习录》',
    authorId: 'wangyangming',
    schoolId: 'lu-wang',
    year: '约1529年',
    description: '王阳明的语录和书信集，由其弟子辑录，共3卷。该书集中体现了王阳明的心学思想，包括"心即理"、"知行合一"、"致良知"等重要命题，是研究心学思想的主要资料。',
  },
  {
    id: 'xiangshan-quanji',
    title: '《象山先生全集》',
    authorId: 'lujiuyuan',
    schoolId: 'lu-wang',
    year: '约1193年',
    description: '陆九渊的著作集，共36卷。该书汇集了陆九渊的书信、语录、诗文等，系统阐述了他的"心即理"、"发明本心"等心学思想，是研究陆王心学的重要典籍。',
  },
  {
    id: 'yichuan-yi-zhuan',
    title: '《伊川易传》',
    authorId: 'chengyi',
    schoolId: 'neo-confucianism',
    year: '约1107年',
    description: '程颐对《周易》的注释，共4卷。该书以儒家思想解《易》，提出了"性即理"、"格物穷理"等重要理学命题，是程朱理学的重要著作。',
  },
];

export const getWorkById = (id: string): Work | undefined => {
  return works.find(work => work.id === id);
};

export const getWorksByAuthor = (authorId: string): Work[] => {
  return works.filter(work => work.authorId === authorId);
};

export const getWorksBySchool = (schoolId: string): Work[] => {
  return works.filter(work => work.schoolId === schoolId);
};
