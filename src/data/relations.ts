import { Relation } from '@/types';

export const relations: Relation[] = [
  {
    id: 'r1',
    sourceId: 'confucianism',
    sourceType: 'school',
    targetId: 'mencius',
    targetType: 'philosopher',
    relationType: 'inheritance',
    description: '孟子继承并发展了孔子的儒家思想，提出性善论和仁政学说',
    strength: 9,
  },
  {
    id: 'r2',
    sourceId: 'confucianism',
    sourceType: 'school',
    targetId: 'xunzi',
    targetType: 'philosopher',
    relationType: 'inheritance',
    description: '荀子继承儒家传统，提出性恶论，强调礼法并用',
    strength: 8,
  },
  {
    id: 'r3',
    sourceId: 'taoism',
    sourceType: 'school',
    targetId: 'zhuangzi',
    targetType: 'philosopher',
    relationType: 'inheritance',
    description: '庄子继承和发展老子的道家思想，提出逍遥游和齐物论',
    strength: 9,
  },
  {
    id: 'r4',
    sourceId: 'xunzi',
    sourceType: 'philosopher',
    targetId: 'hanfei',
    targetType: 'philosopher',
    relationType: 'teacher-student',
    description: '韩非子是荀子的学生，将儒家的礼治思想发展为法家的法治理论',
    strength: 8,
  },
  {
    id: 'r5',
    sourceId: 'shangyang',
    sourceType: 'philosopher',
    targetId: 'hanfei',
    targetType: 'philosopher',
    relationType: 'inheritance',
    description: '韩非子继承商鞅的法、申不害的术、慎到的势，成为法家思想的集大成者',
    strength: 9,
  },
  {
    id: 'r6',
    sourceId: 'taoism',
    sourceType: 'school',
    targetId: 'huang-lao',
    targetType: 'school',
    relationType: 'inheritance',
    description: '黄老之学继承道家无为思想，融合法家思想，形成汉初的治国理念',
    strength: 8,
  },
  {
    id: 'r7',
    sourceId: 'confucianism',
    sourceType: 'school',
    targetId: 'han-confucianism',
    targetType: 'school',
    relationType: 'inheritance',
    description: '汉代经学继承先秦儒家思想，融合阴阳家学说，成为官方意识形态',
    strength: 9,
  },
  {
    id: 'r8',
    sourceId: 'han-confucianism',
    sourceType: 'school',
    targetId: 'dongzhongshu',
    targetType: 'philosopher',
    relationType: 'inheritance',
    description: '董仲舒是汉代经学的代表人物，提出罢黜百家、独尊儒术',
    strength: 10,
  },
  {
    id: 'r9',
    sourceId: 'taoism',
    sourceType: 'school',
    targetId: 'xuan-xue',
    targetType: 'school',
    relationType: 'inheritance',
    description: '魏晋玄学继承道家思想，融合儒家观念，探讨有无、本末等哲学问题',
    strength: 8,
  },
  {
    id: 'r10',
    sourceId: 'xuan-xue',
    sourceType: 'school',
    targetId: 'wangbi',
    targetType: 'philosopher',
    relationType: 'inheritance',
    description: '王弼是魏晋玄学的创始人之一，提出贵无论和得意忘言',
    strength: 9,
  },
  {
    id: 'r11',
    sourceId: 'xuan-xue',
    sourceType: 'school',
    targetId: 'jikang',
    targetType: 'philosopher',
    relationType: 'inheritance',
    description: '嵇康是竹林七贤之一，主张越名教而任自然，发展了玄学思想',
    strength: 8,
  },
  {
    id: 'r12',
    sourceId: 'buddhism',
    sourceType: 'school',
    targetId: 'huineng',
    targetType: 'philosopher',
    relationType: 'inheritance',
    description: '慧能是禅宗六祖，创立禅宗南宗，提出顿悟成佛思想',
    strength: 10,
  },
  {
    id: 'r13',
    sourceId: 'confucianism',
    sourceType: 'school',
    targetId: 'neo-confucianism',
    targetType: 'school',
    relationType: 'inheritance',
    description: '程朱理学继承儒家道统，吸收佛道思想，建立新儒学体系',
    strength: 9,
  },
  {
    id: 'r14',
    sourceId: 'han-confucianism',
    sourceType: 'school',
    targetId: 'neo-confucianism',
    targetType: 'school',
    relationType: 'influence',
    description: '宋明理学在汉代经学的基础上进一步发展，更加注重哲学思辨',
    strength: 7,
  },
  {
    id: 'r15',
    sourceId: 'neo-confucianism',
    sourceType: 'school',
    targetId: 'chengyi',
    targetType: 'philosopher',
    relationType: 'inheritance',
    description: '程颐是北宋理学的创始人之一，提出性即理的重要命题',
    strength: 9,
  },
  {
    id: 'r16',
    sourceId: 'neo-confucianism',
    sourceType: 'school',
    targetId: 'zhuxi',
    targetType: 'philosopher',
    relationType: 'inheritance',
    description: '朱熹是理学的集大成者，建立了完整的理学思想体系',
    strength: 10,
  },
  {
    id: 'r17',
    sourceId: 'neo-confucianism',
    sourceType: 'school',
    targetId: 'lu-wang',
    targetType: 'school',
    relationType: 'influence',
    description: '陆王心学在程朱理学的基础上发展，主张心即理，与理学形成对立',
    strength: 8,
  },
  {
    id: 'r18',
    sourceId: 'lu-wang',
    sourceType: 'school',
    targetId: 'lujiuyuan',
    targetType: 'philosopher',
    relationType: 'inheritance',
    description: '陆九渊是心学的创始人，提出吾心即是宇宙的思想',
    strength: 9,
  },
  {
    id: 'r19',
    sourceId: 'lu-wang',
    sourceType: 'school',
    targetId: 'wangyangming',
    targetType: 'philosopher',
    relationType: 'inheritance',
    description: '王阳明是心学的集大成者，提出致良知和知行合一的重要思想',
    strength: 10,
  },
  {
    id: 'r20',
    sourceId: 'neo-confucianism',
    sourceType: 'school',
    targetId: 'lu-wang',
    targetType: 'school',
    relationType: 'opposition',
    description: '程朱理学主张性即理、格物致知，陆王心学主张心即理、发明本心，形成宋明儒学内部的两大对立阵营',
    strength: 8,
  },
  {
    id: 'r21',
    sourceId: 'confucius',
    sourceType: 'philosopher',
    targetId: 'laozi',
    targetType: 'philosopher',
    relationType: 'influence',
    description: '孔子曾问礼于老子，两人的思想既有区别又有联系',
    strength: 6,
  },
  {
    id: 'r22',
    sourceId: 'zhuangzi',
    sourceType: 'philosopher',
    targetId: 'huishi',
    targetType: 'philosopher',
    relationType: 'influence',
    description: '庄子与惠施是好友，经常辩论，两人的思想相互影响',
    strength: 7,
  },
  {
    id: 'r23',
    sourceId: 'yin-yang',
    sourceType: 'school',
    targetId: 'han-confucianism',
    targetType: 'school',
    relationType: 'influence',
    description: '董仲舒的思想融合了阴阳家的阴阳五行学说，提出天人感应',
    strength: 8,
  },
  {
    id: 'r24',
    sourceId: 'legalism',
    sourceType: 'school',
    targetId: 'huang-lao',
    targetType: 'school',
    relationType: 'influence',
    description: '黄老之学融合了法家的刑名法术思想，主张刑德并用',
    strength: 7,
  },
  {
    id: 'r25',
    sourceId: 'buddhism',
    sourceType: 'school',
    targetId: 'neo-confucianism',
    targetType: 'school',
    relationType: 'influence',
    description: '宋明理学吸收了佛教禅宗的心性思想，发展出儒家的心性论',
    strength: 7,
  },
  {
    id: 'r26',
    sourceId: 'taoism',
    sourceType: 'school',
    targetId: 'neo-confucianism',
    targetType: 'school',
    relationType: 'influence',
    description: '宋明理学吸收了道家的宇宙论思想，构建了天理本体论',
    strength: 7,
  },
];

export const getRelationsByEntity = (entityId: string): Relation[] => {
  return relations.filter(
    r => r.sourceId === entityId || r.targetId === entityId
  );
};

export const getRelationsByType = (relationType: string): Relation[] => {
  return relations.filter(r => r.relationType === relationType);
};

export const getPathBetweenEntities = (
  startId: string,
  endId: string
): Relation[] | null => {
  const visited = new Set<string>();
  const queue: { id: string; path: Relation[] }[] = [{ id: startId, path: [] }];

  while (queue.length > 0) {
    const { id, path } = queue.shift()!;

    if (id === endId) {
      return path;
    }

    if (visited.has(id)) continue;
    visited.add(id);

    const entityRelations = getRelationsByEntity(id);
    for (const relation of entityRelations) {
      const nextId = relation.sourceId === id ? relation.targetId : relation.sourceId;
      if (!visited.has(nextId)) {
        queue.push({
          id: nextId,
          path: [...path, relation],
        });
      }
    }
  }

  return null;
};
