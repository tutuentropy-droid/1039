import { motion } from 'framer-motion';
import { BookOpen, Cloud, Scale, Heart, MessageCircle, Sun, ChevronRight } from 'lucide-react';
import { getMainSchools } from '@/data/schools';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getSchoolGameConfig } from '@/data/gameData';

const iconMap: Record<string, React.ElementType> = {
  'book-open': BookOpen,
  'cloud': Cloud,
  'scale': Scale,
  'heart': Heart,
  'message-circle': MessageCircle,
  'sun': Sun,
};

interface SchoolSelectProps {
  onSelect: (schoolId: string) => void;
}

export const SchoolSelect = ({ onSelect }: SchoolSelectProps) => {
  const mainSchools = getMainSchools().filter(s => s.dynasty === 'pre-qin');

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-stone-50 to-ochre/10 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            百家争鸣模拟器
          </h1>
          <p className="text-xl text-ink/70 max-w-2xl mx-auto">
            选择一个学派，成为其掌门人，在战国乱世中传播你的思想，游说诸侯，最终成为百家之首！
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainSchools.map((school, index) => {
            const Icon = iconMap[school.icon] || BookOpen;
            const config = getSchoolGameConfig(school.id);
            return (
              <motion.div
                key={school.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  hover
                  className="h-full transition-all duration-300 hover:shadow-2xl"
                  style={{
                    borderColor: `${school.color}30`,
                  }}
                >
                  <CardHeader className="relative overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${school.color}, transparent 70%)`,
                      }}
                    />
                    <div className="relative z-10 flex items-center gap-4">
                      <motion.div
                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${school.color}20` }}
                        whileHover={{ rotate: [0, -5, 5, 0 ], transition: { duration: 0.5 } }}
                      >
                        <Icon className="w-7 h-7" style={{ color: school.color }} />
                      </motion.div>
                      <div>
                        <h3 className="text-2xl font-bold" style={{ color: school.color, fontFamily: "'Noto Serif SC', serif" }}>
                          {school.name}
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {school.coreIdeas.slice(0, 3).map((idea) => (
                            <span
                              key={idea}
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${school.color}15`, color: school.color }}
                            >
                              {idea}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-ink/70 mb-4 leading-relaxed">
                      {school.description}
                    </p>
                    
                    {config && (
                      <div className="space-y-3 mb-4">
                      <h4 className="text-sm font-semibold text-ink/80">学派特长</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-ink/50">讲学：</span>
                          <div className="flex-1 bg-stone-200 rounded-full h-2">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${50 + config.lectureBonus}%`, backgroundColor: school.color }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-ink/50">辩论：</span>
                          <div className="flex-1 bg-stone-200 rounded-full h-2">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${50 + config.debateBonus}%`, backgroundColor: school.color }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-ink/50">游说：</span>
                          <div className="flex-1 bg-stone-200 rounded-full h-2">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${50 + config.persuadeBonus}%`, backgroundColor: school.color }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-ink/50">著书：</span>
                          <div className="flex-1 bg-stone-200 rounded-full h-2">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${50 + config.writeBonus}%`, backgroundColor: school.color }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    )}

                    {config && config.abilities.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <h4 className="text-sm font-semibold text-ink/80">独特技能</h4>
                        <div className="space-y-2">
                          {config.abilities.map((ability) => (
                            <div
                              key={ability.id}
                              className="text-xs p-2 rounded-lg"
                              style={{ backgroundColor: `${school.color}10` }}
                            >
                              <div className="font-medium" style={{ color: school.color }}>
                                {ability.name}
                              </div>
                              <div className="text-ink/60 mt-0.5">
                                {ability.effect}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full group"
                      style={{ backgroundColor: school.color }}
                      onClick={() => onSelect(school.id)}
                    >
                      <span className="text-white">选择此派</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SchoolSelect;
