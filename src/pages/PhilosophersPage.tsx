import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Filter, Sparkles } from 'lucide-react';
import { PhilosopherCard } from '@/components/school/PhilosopherCard';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { dataService } from '@/services/dataService';
import { DYNASTY_OPTIONS, DynastyPeriod } from '@/types';
import { cn } from '@/lib/utils';

const DYNASTY_TO_PERIOD_MAP: Record<string, DynastyPeriod> = {
  '春秋': 'pre-qin',
  '战国': 'pre-qin',
  '春秋末战国初': 'pre-qin',
  '西汉': 'han',
  '东汉': 'han',
  '两汉': 'han',
  '曹魏': 'wei-jin',
  '魏晋': 'wei-jin',
  '西晋': 'wei-jin',
  '东晋': 'wei-jin',
  '唐代': 'tang',
  '隋唐': 'tang',
  '北宋': 'song-ming',
  '南宋': 'song-ming',
  '宋代': 'song-ming',
  '明代': 'song-ming',
  '宋明': 'song-ming',
};

const PhilosophersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDynasty, setSelectedDynasty] = useState<DynastyPeriod>('all');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');

  const allPhilosophers = dataService.getAllPhilosophers();
  const allSchools = dataService.getAllSchools();

  const filteredPhilosophers = useMemo(() => {
    return allPhilosophers.filter((philosopher) => {
      const matchSearch =
        !searchQuery ||
        philosopher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        philosopher.biography.toLowerCase().includes(searchQuery.toLowerCase()) ||
        philosopher.coreIdeas.some((idea) =>
          idea.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const philosopherPeriod = DYNASTY_TO_PERIOD_MAP[philosopher.dynasty] || 'all';
      const matchDynasty =
        selectedDynasty === 'all' || philosopherPeriod === selectedDynasty;

      const matchSchool =
        selectedSchool === 'all' || philosopher.schoolId === selectedSchool;

      return matchSearch && matchDynasty && matchSchool;
    });
  }, [allPhilosophers, searchQuery, selectedDynasty, selectedSchool]);

  const stats = useMemo(() => {
    return {
      total: allPhilosophers.length,
      schools: allSchools.length,
      filtered: filteredPhilosophers.length,
    };
  }, [allPhilosophers, allSchools, filteredPhilosophers]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 bg-gradient-to-br from-ochre/5 via-transparent to-indigo-cn/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ochre/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-cn/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-4 border-ochre/30 bg-ochre/5 text-ochre">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              哲学人物全景
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4 leading-tight">
              哲学
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ochre via-cinnabar to-indigo-cn">
                {' '}人物图谱{' '}
              </span>
            </h1>
            <p className="text-lg text-ink/60 mb-8 leading-relaxed">
              从先秦诸子到宋明大儒，探索两千余年中国哲学史上的思想巨擘，
              了解他们的生平、著作与核心思想。
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-ochre mb-1">{stats.total}</div>
                  <div className="text-xs text-ink/60">思想家</div>
                </CardContent>
              </Card>
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-indigo-cn mb-1">{stats.schools}</div>
                  <div className="text-xs text-ink/60">思想流派</div>
                </CardContent>
              </Card>
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-3xl font-bold text-cinnabar mb-1">{stats.filtered}</div>
                  <div className="text-xs text-ink/60">当前展示</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
                    <input
                      type="text"
                      placeholder="搜索思想家姓名、思想、简介..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-stone-100/50 border border-stone-200 rounded-xl text-base text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ochre/50 focus:bg-paper transition-all"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Filter className="w-4 h-4 text-ink/50" />
                    <span className="text-sm font-medium text-ink/70">按朝代筛选</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {DYNASTY_OPTIONS.map((dynasty) => (
                      <Button
                        key={dynasty.id}
                        variant={selectedDynasty === dynasty.id ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedDynasty(dynasty.id)}
                      >
                        {dynasty.name}
                        {dynasty.years && (
                          <span className="ml-1 opacity-70 text-xs">({dynasty.years})</span>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-ink/50" />
                    <span className="text-sm font-medium text-ink/70">按流派筛选</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedSchool === 'all' ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSchool('all')}
                    >
                      全部流派
                    </Button>
                    {allSchools.map((school) => (
                      <button
                        key={school.id}
                        onClick={() => setSelectedSchool(school.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border',
                          selectedSchool === school.id
                            ? 'text-white shadow-md'
                            : 'bg-transparent border-stone-300 text-ink/70 hover:border-stone-400'
                        )}
                        style={
                          selectedSchool === school.id
                            ? { backgroundColor: school.color, borderColor: school.color }
                            : undefined
                        }
                      >
                        {school.name}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {filteredPhilosophers.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPhilosophers.map((philosopher, index) => (
                <motion.div key={philosopher.id} variants={itemVariants}>
                  <PhilosopherCard philosopher={philosopher} index={index} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
                <Search className="w-10 h-10 text-ink/30" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-2">未找到匹配的思想家</h3>
              <p className="text-ink/60 mb-6">
                试试调整筛选条件或搜索关键词
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDynasty('all');
                    setSelectedSchool('all');
                  }}
                >
                  重置筛选
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PhilosophersPage;
