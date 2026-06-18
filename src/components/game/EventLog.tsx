import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollText, Zap, Star, Users, Info } from 'lucide-react';
import { GameEvent } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

interface EventLogProps {
  events: GameEvent[];
}

const typeIcon = {
  action: Zap,
  random: Star,
  system: Info,
};

const typeColor = {
  action: '#D97706',
  random: '#7C3AED',
  system: '#475569',
};

const typeLabel = {
  action: '行动',
  random: '事件',
  system: '系统',
};

export const EventLog = ({ events }: EventLogProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-ochre" />
          <h3 className="font-bold text-ink text-lg">事件记录</h3>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <div
          ref={scrollRef}
          className="h-64 overflow-y-auto px-6 py-2 space-y-2"
        >
          <AnimatePresence initial={false}>
            {events.slice(-20).map((event, index) => {
              const Icon = typeIcon[event.type];
              const color = typeColor[event.type];

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-xs font-medium px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        {typeLabel[event.type]}
                      </span>
                      <span className="text-xs text-ink/40">第{event.turn}回合</span>
                    </div>
                    <h4 className="text-sm font-medium text-ink truncate">
                      {event.title}
                    </h4>
                    <p className="text-xs text-ink/50 line-clamp-2 mt-0.5">
                      {event.description}
                    </p>
                    {(event.effects.prestige || event.effects.disciples || event.effects.energy || event.effects.influence) && (
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        {event.effects.prestige && (
                          <span className={`text-xs font-medium ${event.effects.prestige > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            声望 {event.effects.prestige > 0 ? '+' : ''}{event.effects.prestige}
                          </span>
                        )}
                        {event.effects.disciples && (
                          <span className={`text-xs font-medium ${event.effects.disciples > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            门徒 {event.effects.disciples > 0 ? '+' : ''}{event.effects.disciples}
                          </span>
                        )}
                        {event.effects.energy && (
                          <span className={`text-xs font-medium ${event.effects.energy > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            体力 {event.effects.energy > 0 ? '+' : ''}{event.effects.energy}
                          </span>
                        )}
                        {event.effects.influence && Object.entries(event.effects.influence).map(([state, value]) => (
                          <span key={state} className={`text-xs font-medium ${value > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            {state.toUpperCase()} {value > 0 ? '+' : ''}{value}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventLog;
