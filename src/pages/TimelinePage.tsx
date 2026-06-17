import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Timeline } from '@/components/ui/Timeline';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { dataService } from '@/services/dataService';
import { DYNASTY_OPTIONS, DynastyPeriod, TimelineEvent } from '@/types';
import { cn } from '@/lib/utils';

const TimelinePage = () => {
  const navigate = useNavigate();
  const [selectedDynasty, setSelectedDynasty] = useState<DynastyPeriod>('all');
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const allSchools = dataService.getAllSchools();

  const filteredEvents = useMemo(() => {
    let events = dataService.getFilteredTimelineEvents(selectedDynasty, selectedSchools);
    if (searchQuery) {
      const term = searchQuery.toLowerCase();
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          event.description.toLowerCase().includes(term)
      );
    }
    return events;
  }, [selectedDynasty, selectedSchools, searchQuery]);

  const stats = useMemo(() => {
    const allEvents = dataService.getAllTimelineEvents();
    const births = allEvents.filter((e) => e.title.includes('诞生')).length;
    const deaths = allEvents.filter((e) => e.title.includes('逝世')).length;
    const works = allEvents.filter((e) => e.title.includes('问世')).length;
    return { births, deaths, works, total: allEvents.length };
  }, []);

  const toggleSchool = (schoolId: string) => {
    setSelectedSchools((prev) =>
      prev.includes(schoolId) ? prev.filter((id) => id !== schoolId) : [...prev, schoolId]
    );
  };

  const handleEventClick = (event: TimelineEvent) => {
    if (event.philosopherId) {
      navigate(`/philosopher/${event.philosopherId}`);
    } else if (event.schoolId) {
      navigate(`/school/${event.schoolId}`);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-16 bg-gradient-to-br from-indigo-cn/5 via-transparent to-ochre/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-cn/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-ochre/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-4 border-indigo-cn/30 bg-indigo-cn/5 text-indigo-cn">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              两千年思想长河
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4 leading-tight">
              思想
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-cn via-ochre to-cinnabar">
                {' '}历史时间轴{' '}
              </span>
            </h1>
            <p className="text-lg text-ink/60 mb-8 leading-relaxed">
              从先秦诸子百家争鸣到宋明理学的融会贯通，
              穿越时空，一览中国哲学史上的重要时刻与思想巨擘。
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-cn mb-1">{stats.total}</div>
                  <div className="text-xs text-ink/60">历史事件</div>
                </CardContent>
              </Card>
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-ochre mb-1">{stats.births}</div>
                  <div className="text-xs text-ink/60">思想家诞生</div>
                </CardContent>
              </Card>
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-cinnabar mb-1">{stats.works}</div>
                  <div className="text-xs text-ink/60">经典著作</div>
                </CardContent>
              </Card>
              <Card className="bg-white/60 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-jade mb-1">{filteredEvents.length}</div>
                  <div className="text-xs text-ink/60">当前展示</div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-white/70 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="relative mb-5">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
                  <input
                    type="text"
                    placeholder="搜索历史事件..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-stone-100/50 border border-stone-200 rounded-xl text-base text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-indigo-cn/50 focus:bg-paper transition-all"
                  />
                </div>

                <div className="mb-5">
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

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-ink/50" />
                      <span className="text-sm font-medium text-ink/70">按流派筛选</span>
                    </div>
                    {selectedSchools.length > 0 && (
                      <button
                        onClick={() => setSelectedSchools([])}
                        className="text-xs text-ochre hover:text-ochre/80 transition-colors"
                      >
                        清除选择 ({selectedSchools.length})
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allSchools.map((school) => {
                      const isSelected = selectedSchools.includes(school.id);
                      return (
                        <button
                          key={school.id}
                          onClick={() => toggleSchool(school.id)}
                          className={cn(
                            'px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border',
                            isSelected
                              ? 'text-white shadow-md'
                              : 'bg-transparent border-stone-300 text-ink/70 hover:border-stone-400'
                          )}
                          style={
                            isSelected
                              ? { backgroundColor: school.color, borderColor: school.color }
                              : undefined
                          }
                        >
                          {school.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {filteredEvents.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                className="space-y-2 cursor-pointer"
                onClick={(e) => {
                  const target = e.target as HTMLElement;
                  const eventElement = target.closest('[data-event-id]') as HTMLElement | null;
                  if (eventElement) {
                    const eventId = eventElement.dataset.eventId;
                    const event = filteredEvents.find((ev) => ev.id === eventId);
                    if (event) handleEventClick(event);
                  }
                }}
              >
                <Timeline events={filteredEvents} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-stone-100 flex items-center justify-center">
                <Calendar className="w-10 h-10 text-ink/30" />
              </div>
              <h3 className="text-xl font-semibold text-ink mb-2">未找到匹配的历史事件</h3>
              <p className="text-ink/60 mb-6">试试调整筛选条件或搜索关键词</p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDynasty('all');
                    setSelectedSchools([]);
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

export default TimelinePage;
