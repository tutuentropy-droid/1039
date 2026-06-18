import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { RandomEvent } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface EventModalProps {
  event: RandomEvent | null;
  onChoice: (choiceIndex: number) => void;
}

export const EventModal = ({ event, onChoice }: EventModalProps) => {
  if (!event) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg"
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white/80 text-sm">突发事件</p>
                  <h2 className="text-2xl font-bold text-white">{event.title}</h2>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-ink/70 leading-relaxed mb-6">
                {event.description}
              </p>
              
              {event.choices && (
                <div className="space-y-3">
                  {event.choices.map((choice, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left p-4 h-auto"
                      onClick={() => onChoice(index)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-ink/60">
                          {index + 1}
                        </span>
                        <div>
                          <div className="font-medium text-ink">{choice.text}</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {choice.effects.prestige && (
                              <span className={`text-xs font-medium ${choice.effects.prestige > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                声望 {choice.effects.prestige > 0 ? '+' : ''}{choice.effects.prestige}
                              </span>
                            )}
                            {choice.effects.disciples && (
                              <span className={`text-xs font-medium ${choice.effects.disciples > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                门徒 {choice.effects.disciples > 0 ? '+' : ''}{choice.effects.disciples}
                              </span>
                            )}
                            {choice.effects.energy && (
                              <span className={`text-xs font-medium ${choice.effects.energy > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                体力 {choice.effects.energy > 0 ? '+' : ''}{choice.effects.energy}
                              </span>
                            )}
                            {choice.effects.influence && Object.entries(choice.effects.influence).map(([state, value]) => (
                              <span key={state} className={`text-xs font-medium ${value > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {state.toUpperCase()} {value > 0 ? '+' : ''}{value}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EventModal;
