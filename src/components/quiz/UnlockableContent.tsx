import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { unlockablePhilosophers, unlockableEvents } from '@/data/quizGameData';
import { useQuizGameStore } from '@/store/quizGameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Lock, Unlock, User, Calendar, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { philosophers } from '@/data/philosophers';

interface UnlockableContentProps {
  className?: string;
}

type ContentType = 'philosopher' | 'event';

export const UnlockableContent = ({ className }: UnlockableContentProps) => {
  const { level, unlockedPhilosophers, unlockedEvents } = useQuizGameStore();
  const [expandedType, setExpandedType] = useState<ContentType | null>('philosopher');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const toggleSection = (type: ContentType) => {
    setExpandedType(prev => prev === type ? null : type);
  };

  const getPhilosopherImage = (refId: string) => {
    const philosopher = philosophers.find(p => p.id === refId);
    return philosopher?.imageUrl;
  };

  const renderItems = (items: typeof unlockablePhilosophers, type: ContentType) => {
    const unlockedIds = type === 'philosopher' ? unlockedPhilosophers : unlockedEvents;
    
    return items.map(item => {
      const isUnlocked = unlockedIds.includes(item.refId);
      const Icon = type === 'philosopher' ? User : Calendar;
      
      return (
        <motion.div
          key={item.id}
          whileHover={{ scale: isUnlocked ? 1.02 : 1 }}
          className={cn(
            'p-3 rounded-xl border transition-all cursor-pointer',
            isUnlocked
              ? 'border-stone-200 bg-white hover:border-ochre/30 hover:shadow-sm'
              : 'border-stone-100 bg-stone-50 opacity-60 cursor-not-allowed'
          )}
          onClick={() => isUnlocked && setSelectedItem(item.refId)}
        >
          <div className="flex items-center gap-3">
            {type === 'philosopher' && isUnlocked && getPhilosopherImage(item.refId) ? (
              <img
                src={getPhilosopherImage(item.refId)!}
                alt={item.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center',
                  isUnlocked ? 'bg-ochre/10 text-ochre' : 'bg-stone-200 text-stone-400'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className={cn(
                'font-medium text-sm truncate',
                isUnlocked ? 'text-ink' : 'text-stone-400'
              )}>
                {item.name}
              </p>
              <p className="text-xs text-ink/50 truncate">{item.description}</p>
            </div>
            
            {isUnlocked ? (
              <Unlock className="w-4 h-4 text-jade flex-shrink-0" />
            ) : (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Lock className="w-4 h-4 text-stone-400" />
                <span className="text-xs text-stone-400">Lv.{item.unlockLevel}</span>
              </div>
            )}
          </div>
        </motion.div>
      );
    });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-cn" />
          解锁内容
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <div>
          <button
            onClick={() => toggleSection('philosopher')}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-jade" />
              <span className="font-medium text-ink text-sm">哲学家</span>
              <Badge variant="outline" className="text-xs">
                {unlockedPhilosophers.length}/{unlockablePhilosophers.length}
              </Badge>
            </div>
            {expandedType === 'philosopher' ? (
              <ChevronUp className="w-4 h-4 text-ink/50" />
            ) : (
              <ChevronDown className="w-4 h-4 text-ink/50" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedType === 'philosopher' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-2">
                  {renderItems(unlockablePhilosophers, 'philosopher')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <button
            onClick={() => toggleSection('event')}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cinnabar" />
              <span className="font-medium text-ink text-sm">历史事件</span>
              <Badge variant="outline" className="text-xs">
                {unlockedEvents.length}/{unlockableEvents.length}
              </Badge>
            </div>
            {expandedType === 'event' ? (
              <ChevronUp className="w-4 h-4 text-ink/50" />
            ) : (
              <ChevronDown className="w-4 h-4 text-ink/50" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedType === 'event' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-2">
                  {renderItems(unlockableEvents, 'event')}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};
