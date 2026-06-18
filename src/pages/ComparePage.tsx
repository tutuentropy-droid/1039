import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  Users,
  BookOpen,
  ChevronDown,
  ArrowRightLeft,
  Sparkles,
  X,
  Check,
  Info,
} from 'lucide-react';
import { dataService } from '@/services/dataService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { School, Philosopher } from '@/types';
import { CompareDimension } from '@/data/comparisons';

type CompareMode = 'philosopher' | 'school';

const quickPresets: Array<{
  label: string;
  mode: CompareMode;
  leftId: string;
  rightId: string;
}> = [
  { label: '孔子 vs 韩非子', mode: 'philosopher', leftId: 'confucius', rightId: 'hanfei' },
  { label: '儒家 vs 道家', mode: 'school', leftId: 'confucianism', rightId: 'taoism' },
  { label: '孟子 vs 荀子', mode: 'philosopher', leftId: 'mencius', rightId: 'xunzi' },
  { label: '朱熹 vs 王阳明', mode: 'philosopher', leftId: 'zhuxi', rightId: 'wangyangming' },
  { label: '老子 vs 庄子', mode: 'philosopher', leftId: 'laozi', rightId: 'zhuangzi' },
  { label: '儒家 vs 法家', mode: 'school', leftId: 'confucianism', rightId: 'legalism' },
  { label: '程朱理学 vs 陆王心学', mode: 'school', leftId: 'neo-confucianism', rightId: 'lu-wang' },
  { label: '墨子 vs 孔子', mode: 'philosopher', leftId: 'mozi', rightId: 'confucius' },
];

interface EntitySelectProps {
  mode: CompareMode;
  value: string | null;
  onChange: (id: string | null) => void;
  placeholder: string;
  accentColor: string;
  excludeId?: string | null;
}

const EntitySelect = ({ mode, value, onChange, placeholder, accentColor, excludeId }: EntitySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const entities: Array<School | Philosopher> = useMemo(() => {
    if (mode === 'school') {
      const list = dataService.getComparableSchools();
      if (!searchTerm) return list;
      const term = searchTerm.toLowerCase();
      return list.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.description.toLowerCase().includes(term) ||
          s.coreIdeas.some((i) => i.toLowerCase().includes(term))
      );
    } else {
      const list = dataService.getComparablePhilosophers();
      if (!searchTerm) return list;
      const term = searchTerm.toLowerCase();
      return list.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.biography.toLowerCase().includes(term) ||
          p.coreIdeas.some((i) => i.toLowerCase().includes(term))
      );
    }
  }, [mode, searchTerm]);

  const selectedEntity = useMemo(() => {
    if (!value) return null;
    if (mode === 'school') return dataService.getSchoolById(value);
    return dataService.getPhilosopherById(value);
  }, [mode, value]);

  const entityColor = (entity: School | Philosopher) => {
    if ('color' in entity) return entity.color;
    const school = dataService.getSchoolById(entity.schoolId);
    return school?.color || '#8B4513';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center gap-3 p-4 rounded-xl border-2 bg-white transition-all text-left',
          isOpen ? 'border-ochre/60 ring-2 ring-ochre/20' : 'border-stone-200 hover:border-stone-300'
        )}
        style={value && selectedEntity ? { borderColor: entityColor(selectedEntity) + '80' } : {}}
      >
        {selectedEntity ? (
          <>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md flex-shrink-0"
              style={{ backgroundColor: entityColor(selectedEntity) }}
            >
              {selectedEntity.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-ink">{selectedEntity.name}</div>
              <div className="text-xs text-ink/50 truncate">
                {mode === 'school'
                  ? (selectedEntity as School).period
                  : `${(selectedEntity as Philosopher).dynasty} · ${(selectedEntity as Philosopher).birthYear} - ${(selectedEntity as Philosopher).deathYear}`}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {value && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(null);
                  }}
                  className="p-1 rounded-md hover:bg-stone-100 text-ink/40 hover:text-ink/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <ChevronDown
                className={cn(
                  'w-5 h-5 text-ink/40 transition-transform',
                  isOpen && 'rotate-180'
                )}
              />
            </div>
          </>
        ) : (
          <>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: accentColor + '15' }}
            >
              {mode === 'school' ? (
                <BookOpen className="w-5 h-5" style={{ color: accentColor }} />
              ) : (
                <Users className="w-5 h-5" style={{ color: accentColor }} />
              )}
            </div>
            <div className="flex-1">
              <div className="font-medium text-ink/50">{placeholder}</div>
              <div className="text-xs text-ink/30">
                {mode === 'school' ? '选择一个思想流派' : '选择一位哲学家'}
              </div>
            </div>
            <ChevronDown className="w-5 h-5 text-ink/40" />
          </>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute z-30 left-0 right-0 mt-2 rounded-xl border border-stone-200 bg-white shadow-xl overflow-hidden"
          >
            <div className="p-3 border-b border-stone-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`搜索${mode === 'school' ? '流派' : '哲学家'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ochre/40 focus:bg-white"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto py-1">
              {entities.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-ink/40">没有找到匹配项</div>
              ) : (
                entities.map((entity) => {
                  const isExcluded = excludeId && entity.id === excludeId;
                  const isSelected = value === entity.id;
                  return (
                    <button
                      key={entity.id}
                      onClick={() => {
                        if (!isExcluded) {
                          onChange(entity.id);
                          setIsOpen(false);
                          setSearchTerm('');
                        }
                      }}
                      disabled={isExcluded}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                        isExcluded ? 'opacity-40 cursor-not-allowed' : 'hover:bg-stone-50',
                        isSelected && 'bg-ochre/5'
                      )}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ backgroundColor: entityColor(entity) }}
                      >
                        {entity.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-ink">
                          {entity.name}
                          {isExcluded && <span className="ml-2 text-xs text-ink/40">（已在另一侧选择）</span>}
                        </div>
                        <div className="text-xs text-ink/50 truncate">
                          {mode === 'school'
                            ? `${(entity as School).period} · ${(entity as School).coreIdeas.slice(0, 3).join('、')}`
                            : `${(entity as Philosopher).dynasty} · ${(entity as Philosopher).coreIdeas.slice(0, 3).join('、')}`}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-ochre flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ComparePage = () => {
  const [mode, setMode] = useState<CompareMode>('philosopher');
  const [leftId, setLeftId] = useState<string | null>('confucius');
  const [rightId, setRightId] = useState<string | null>('hanfei');

  const dimensions = dataService.getCompareDimensions();

  const leftComparison = leftId ? dataService.getComparisonByEntity(leftId, mode) : null;
  const rightComparison = rightId ? dataService.getComparisonByEntity(rightId, mode) : null;

  const leftEntity = leftId
    ? mode === 'school'
      ? dataService.getSchoolById(leftId)
      : dataService.getPhilosopherById(leftId)
    : null;
  const rightEntity = rightId
    ? mode === 'school'
      ? dataService.getSchoolById(rightId)
      : dataService.getPhilosopherById(rightId)
    : null;

  const entityColor = (entity: School | Philosopher | null | undefined) => {
    if (!entity) return '#8B4513';
    if ('color' in entity) return entity.color;
    const school = dataService.getSchoolById(entity.schoolId);
    return school?.color || '#8B4513';
  };

  const handleSwap = () => {
    setLeftId(rightId);
    setRightId(leftId);
  };

  const handlePresetSelect = (preset: (typeof quickPresets)[0]) => {
    setMode(preset.mode);
    setLeftId(preset.leftId);
    setRightId(preset.rightId);
  };

  const hasComparison = leftComparison && rightComparison;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <Badge className="mb-4 border-ochre/30 bg-ochre/5 text-ochre">
            <Scale className="w-3.5 h-3.5 mr-1.5" />
            思想观点对比系统
          </Badge>
          <h1 className="text-4xl font-bold text-ink mb-3">
            跨越千年的<span className="text-transparent bg-clip-text bg-gradient-to-r from-ochre to-indigo-cn">思想对话</span>
          </h1>
          <p className="text-ink/60 max-w-2xl mx-auto">
            选择两位哲学家或两个思想流派，从政治观、伦理观、人生观、教育观等多个维度，深入对比他们的思想异同
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row items-center lg:items-end gap-4 mb-6">
                <div className="flex-shrink-0">
                  <div className="text-sm font-medium text-ink/60 mb-2">对比模式</div>
                  <div className="inline-flex p-1 bg-stone-100 rounded-xl">
                    <button
                      onClick={() => setMode('philosopher')}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                        mode === 'philosopher'
                          ? 'bg-white text-ink shadow-sm'
                          : 'text-ink/50 hover:text-ink/70'
                      )}
                    >
                      <Users className="w-4 h-4" />
                      哲学家对比
                    </button>
                    <button
                      onClick={() => setMode('school')}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                        mode === 'school'
                          ? 'bg-white text-ink shadow-sm'
                          : 'text-ink/50 hover:text-ink/70'
                      )}
                    >
                      <BookOpen className="w-4 h-4" />
                      流派对比
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-ink/60 mb-2">快速选择</div>
                  <div className="flex flex-wrap gap-2">
                    {quickPresets
                      .filter((p) => p.mode === mode)
                      .map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => handlePresetSelect(preset)}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                            leftId === preset.leftId && rightId === preset.rightId
                              ? 'bg-ink text-paper border-ink'
                              : 'bg-white text-ink/70 border-stone-200 hover:border-ochre/50 hover:text-ink'
                          )}
                        >
                          {preset.label}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm font-medium text-ink/60 mb-2 flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-ochre flex-shrink-0" />
                    甲方
                  </div>
                  <EntitySelect
                    mode={mode}
                    value={leftId}
                    onChange={setLeftId}
                    placeholder={`请选择${mode === 'school' ? '流派' : '哲学家'}`}
                    accentColor="#D97706"
                    excludeId={rightId}
                  />
                </div>

                <div className="flex lg:flex-col items-center justify-center gap-2 lg:py-6">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-ochre to-indigo-cn flex items-center justify-center shadow-lg">
                    <Scale className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSwap}
                    className="text-ink/50 hover:text-ink"
                  >
                    <ArrowRightLeft className="w-4 h-4 mr-1" />
                    交换
                  </Button>
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium text-ink/60 mb-2 flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-indigo-cn flex-shrink-0" />
                    乙方
                  </div>
                  <EntitySelect
                    mode={mode}
                    value={rightId}
                    onChange={setRightId}
                    placeholder={`请选择${mode === 'school' ? '流派' : '哲学家'}`}
                    accentColor="#4338CA"
                    excludeId={leftId}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {hasComparison ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              {[
                { entity: leftEntity, comp: leftComparison, side: 'left', color: entityColor(leftEntity) },
                { entity: rightEntity, comp: rightComparison, side: 'right', color: entityColor(rightEntity) },
              ].map(({ entity, comp, side, color }) =>
                entity && comp ? (
                  <Card key={side} borderColor={color + '50'}>
                    <div
                      className="h-2"
                      style={{
                        background: `linear-gradient(90deg, ${color} 0%, ${color}aa 100%)`,
                      }}
                    />
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0"
                          style={{ backgroundColor: color }}
                        >
                          {entity.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-ink mb-1">{entity.name}</h3>
                          <p className="text-sm text-ink/60 mb-3">
                            {mode === 'school'
                              ? (entity as School).period
                              : `${(entity as Philosopher).dynasty} · ${(entity as Philosopher).birthYear} - ${(entity as Philosopher).deathYear}`}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {entity.coreIdeas.slice(0, 5).map((idea) => (
                              <Badge
                                key={idea}
                                variant="outline"
                                className="text-xs"
                                style={{ borderColor: color + '40', color }}
                              >
                                {idea}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null
              )}
            </div>

            <div className="space-y-3">
              {dimensions.map((dim, idx) => (
                <motion.div
                  key={dim.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.08 }}
                >
                  <Card>
                    <CardHeader className="pb-0">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-1 h-6 rounded-full bg-gradient-to-b from-ochre to-indigo-cn"
                        />
                        <CardTitle className="text-lg flex items-center gap-2">
                          {dim.name}
                          <span className="group relative ml-1">
                            <Info className="w-4 h-4 text-ink/30 group-hover:text-ink/50 transition-colors cursor-help" />
                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-ink text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              {dim.description}
                            </span>
                          </span>
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className="p-4 rounded-xl"
                          style={{ backgroundColor: entityColor(leftEntity) + '08' }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: entityColor(leftEntity) }}
                            />
                            <span className="text-sm font-semibold" style={{ color: entityColor(leftEntity) }}>
                              {leftEntity?.name}
                            </span>
                          </div>
                          <p className="text-sm text-ink/80 leading-relaxed">
                            {leftComparison?.dimensions[dim.id as CompareDimension]}
                          </p>
                        </div>
                        <div
                          className="p-4 rounded-xl"
                          style={{ backgroundColor: entityColor(rightEntity) + '08' }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ backgroundColor: entityColor(rightEntity) }}
                            />
                            <span className="text-sm font-semibold" style={{ color: entityColor(rightEntity) }}>
                              {rightEntity?.name}
                            </span>
                          </div>
                          <p className="text-sm text-ink/80 leading-relaxed">
                            {rightComparison?.dimensions[dim.id as CompareDimension]}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mt-10"
            >
              <Card className="bg-gradient-to-br from-ochre/5 via-paper to-indigo-cn/5 border-ochre/10">
                <CardContent className="p-8 text-center">
                  <Sparkles className="w-8 h-8 text-ochre mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-ink mb-2">智慧的碰撞</h3>
                  <p className="text-sm text-ink/60 max-w-2xl mx-auto">
                    每一种思想都有其时代背景与价值关怀。通过对比，我们不仅能看到先贤们的差异，更能理解中国哲学的丰富多元与生生不息。愿您在这场跨越千年的对话中，找到属于自己的思考。
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                  <Scale className="w-10 h-10 text-ink/30" />
                </div>
                <h3 className="text-lg font-medium text-ink/70 mb-2">请选择对比对象</h3>
                <p className="text-sm text-ink/40">
                  从上方选择器中分别选择两位{mode === 'school' ? '思想流派' : '哲学家'}，即可生成多维度对比
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
