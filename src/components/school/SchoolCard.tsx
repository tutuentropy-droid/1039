import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, BookOpen, Lightbulb } from 'lucide-react';
import { School } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { dataService } from '@/services/dataService';
import { cn } from '@/lib/utils';

interface SchoolCardProps {
  school: School;
  index?: number;
  variant?: 'default' | 'compact';
}

export const SchoolCard = ({ school, index = 0, variant = 'default' }: SchoolCardProps) => {
  const navigate = useNavigate();
  const philosophers = dataService.getPhilosophersBySchool(school.id);
  const works = dataService.getWorksBySchool(school.id);

  const handleClick = () => {
    navigate(`/school/${school.id}`);
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card
          hover
          borderColor={school.color + '40'}
          onClick={handleClick}
          className="group"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-lg flex-shrink-0"
                style={{ backgroundColor: school.color }}
              >
                {school.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-ink truncate">{school.name}</h4>
                <p className="text-xs text-ink/50">{school.period}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-ink/30 group-hover:text-ink/60 group-hover:translate-x-1 transition-all" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <Card
        hover
        borderColor={school.color + '40'}
        onClick={handleClick}
        className="h-full group overflow-hidden"
      >
        <div className="relative h-32 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${school.color} 0%, ${school.color}dd 100%)`,
            }}
          />
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/20"
              style={{ filter: 'blur(20px)' }}
            />
            <div
              className="absolute right-16 bottom-0 w-24 h-24 rounded-full bg-white/10"
              style={{ filter: 'blur(15px)' }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
              <span className="text-4xl font-bold text-white">{school.name.charAt(0)}</span>
            </div>
          </div>
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              {school.period}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-ink mb-1">{school.name}</h3>
              <p className="text-sm text-ink/50">{school.dynasty}时期</p>
            </div>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:rotate-12"
              style={{ backgroundColor: school.color + '20' }}
            >
              <BookOpen className="w-4 h-4" style={{ color: school.color }} />
            </div>
          </div>

          <p className="text-sm text-ink/70 leading-relaxed line-clamp-3 mb-4">
            {school.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {school.coreIdeas.slice(0, 4).map((idea) => (
              <Badge
                key={idea}
                variant="outline"
                className="text-xs"
                style={{ borderColor: school.color + '50', color: school.color }}
              >
                {idea}
              </Badge>
            ))}
            {school.coreIdeas.length > 4 && (
              <Badge variant="outline" className="text-xs text-ink/50">
                +{school.coreIdeas.length - 4}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-stone-100">
            <div className="flex items-center gap-1.5 text-sm text-ink/60">
              <Users className="w-4 h-4" />
              <span>{philosophers.length}位代表人物</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-ink/60">
              <Lightbulb className="w-4 h-4" />
              <span>{school.coreIdeas.length}个核心观点</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: school.color }}>
              查看详情
            </span>
            <ArrowRight
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              style={{ color: school.color }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
