import { motion } from 'framer-motion';
import { useQuizGameStore } from '@/store/quizGameStore';
import { getLevelInfo, unlockablePhilosophers, unlockableEvents } from '@/data/quizGameData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Award, Flame, Star, BookOpen, Calendar, User, Lock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlayerStatsProps {
  className?: string;
}

export const PlayerStats = ({ className }: PlayerStatsProps) => {
  const { level, exp, totalExp, streak, unlockedPhilosophers, unlockedEvents } = useQuizGameStore();
  const levelInfo = getLevelInfo(exp);

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="bg-gradient-to-r from-ochre/10 via-amber-50 to-indigo-cn/10 border-b">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
            style={{ backgroundColor: levelInfo.level.color }}
          >
            Lv.{level}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl">{levelInfo.level.name}</CardTitle>
            <p className="text-sm text-ink/60 mt-0.5">
              经验值: {exp} / {levelInfo.nextLevelExp}
            </p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 rounded-full">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-700">{streak}天</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ 
                width: `${levelInfo.progress}%`,
                background: `linear-gradient(90deg, ${levelInfo.level.color}, ${levelInfo.level.color}dd)`
              }}
              initial={{ width: 0 }}
              animate={{ width: `${levelInfo.progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-stone-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-4 h-4 text-ochre" />
              <span className="text-2xl font-bold text-ink">{totalExp}</span>
            </div>
            <p className="text-xs text-ink/60">总经验值</p>
          </div>
          <div className="bg-stone-50 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award className="w-4 h-4 text-indigo-cn" />
              <span className="text-2xl font-bold text-ink">{level}</span>
            </div>
            <p className="text-xs text-ink/60">当前等级</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-ink/70">解锁进度</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-jade" />
              <span className="text-sm text-ink/70">
                哲学家: {unlockedPhilosophers.length}/{unlockablePhilosophers.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cinnabar" />
              <span className="text-sm text-ink/70">
                历史事件: {unlockedEvents.length}/{unlockableEvents.length}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
