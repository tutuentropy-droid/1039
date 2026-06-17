import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Lightbulb, BookOpen, History, Network } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { School } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Timeline } from '@/components/ui/Timeline';
import { PhilosopherCard } from './PhilosopherCard';
import { dataService } from '@/services/dataService';
import { TimelineEvent } from '@/types';

interface SchoolDetailProps {
  school: School;
}

export const SchoolDetail = ({ school }: SchoolDetailProps) => {
  const navigate = useNavigate();
  const details = useMemo(() => dataService.getSchoolWithPhilosophers(school.id), [school.id]);

  const timelineEvents = useMemo<TimelineEvent[]>(() => {
    const events: TimelineEvent[] = [];

    if (details?.philosophers) {
      details.philosophers.forEach((p) => {
        events.push({
          id: `ev-${p.id}`,
          year: p.birthYear,
          title: `${p.name} 诞生`,
          description: `${p.name}，${p.dynasty}时期${school.name}代表人物，核心思想：${p.coreIdeas.slice(0, 2).join('、')}`,
          schoolId: school.id,
          philosopherId: p.id,
        });
      });
    }

    if (details?.works) {
      details.works.forEach((w) => {
        events.push({
          id: `ev-${w.id}`,
          year: w.year,
          title: `《${w.title}》成书`,
          description: w.description.substring(0, 50),
          schoolId: school.id,
        });
      });
    }

    events.sort((a, b) => {
      const parseYear = (y: string) => {
        const match = y.match(/前(\d+)/);
        if (match) return -parseInt(match[1]);
        const num = y.match(/(\d+)/);
        return num ? parseInt(num[1]) : 0;
      };
      return parseYear(a.year) - parseYear(b.year);
    });

    return events.slice(0, 6);
  }, [details, school.id, school.name]);

  const parentSchool = school.parentId ? dataService.getSchoolById(school.parentId) : null;
  const childSchools = dataService.getChildSchools(school.id);

  return (
    <div className="min-h-screen">
      <div className="relative h-64 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${school.color} 0%, ${school.color}dd 50%, ${school.color}aa 100%)`,
          }}
        />
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/20"
            style={{ filter: 'blur(40px)' }}
          />
          <div
            className="absolute right-40 bottom-0 w-60 h-60 rounded-full bg-white/10"
            style={{ filter: 'blur(30px)' }}
          />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="w-full">
            <Button
              variant="ghost"
              className="mb-4 text-white/80 hover:text-white hover:bg-white/10"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回首页
            </Button>

            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-3 border-white/40 shadow-2xl">
                <span className="text-5xl font-bold text-white">{school.name.charAt(0)}</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{school.name}</h1>
                <div className="flex items-center gap-3 text-white/80">
                  <Badge className="bg-white/20 text-white border-white/30">{school.period}</Badge>
                  <span>{school.dynasty}时期</span>
                  {parentSchool && (
                    <>
                      <span className="text-white/40">·</span>
                      <span className="flex items-center gap-1">
                        <History className="w-3.5 h-3.5" />
                        源自 {parentSchool.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" style={{ color: school.color }} />
                  流派简介
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ink/80 leading-relaxed text-base">{school.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" style={{ color: school.color }} />
                  核心观点
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {school.coreIdeas.map((idea, idx) => (
                    <motion.div
                      key={idea}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative group"
                    >
                      <div
                        className="h-24 rounded-xl border-2 flex flex-col items-center justify-center p-3 transition-all group-hover:shadow-lg cursor-default"
                        style={{
                          borderColor: school.color + '40',
                          backgroundColor: school.color + '08',
                        }}
                      >
                        <span
                          className="text-3xl font-bold mb-1"
                          style={{ color: school.color }}
                        >
                          {idea}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: school.color }} />
                  代表人物
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {details?.philosophers.map((p, idx) => (
                    <PhilosopherCard key={p.id} philosopher={p} index={idx} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {timelineEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" style={{ color: school.color }} />
                    思想发展时间线
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Timeline events={timelineEvents} />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {details?.works && details.works.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" style={{ color: school.color }} />
                    代表著作
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {details.works.map((work, idx) => (
                    <motion.div
                      key={work.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 bg-stone-50 rounded-xl border border-stone-200 hover:border-stone-300 transition-colors"
                    >
                      <h4 className="font-bold text-ink mb-1">{work.title}</h4>
                      <p className="text-xs text-ink/50 mb-2">{work.year}</p>
                      <p className="text-sm text-ink/70 leading-relaxed">{work.description}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}

            {childSchools.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5" style={{ color: school.color }} />
                    衍生流派
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {childSchools.map((child, idx) => (
                    <motion.div
                      key={child.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all group"
                      style={{ borderColor: child.color + '40' }}
                      onClick={() => navigate(`/school/${child.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: child.color }}
                        >
                          {child.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-ink group-hover:text-ink/80 transition-colors">
                            {child.name}
                          </h4>
                          <p className="text-xs text-ink/50">{child.period}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-4">
                <Button
                  className="w-full"
                  style={{ backgroundColor: school.color }}
                  onClick={() => navigate('/relations')}
                >
                  <Network className="w-4 h-4 mr-2" />
                  探索思想关系
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
