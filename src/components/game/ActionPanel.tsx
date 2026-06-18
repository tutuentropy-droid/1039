import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MessageCircle, Users, Scroll, Zap, Sparkles } from 'lucide-react';
import { ActionType, ACTION_CONFIGS, GameState, SchoolAbility } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { getSchoolById } from '@/data/schools';

const iconMap: Record<string, React.ElementType> = {
  'book-open': BookOpen,
  'message-circle': MessageCircle,
  'users': Users,
  'scroll': Scroll,
};

interface ActionPanelProps {
  gameState: GameState;
  onAction: (action: ActionType) => void;
  onUseAbility: (abilityId: string) => void;
  onEndTurn: () => void;
}

export const ActionPanel = ({ gameState, onAction, onUseAbility, onEndTurn }: ActionPanelProps) => {
  const [hoveredAction, setHoveredAction] = useState<ActionType | null>(null);
  const school = gameState.playerSchoolId
    ? getSchoolById(gameState.playerSchoolId)
    : null;

  const schoolColor = school?.color || '#8B4513';

  const actions: ActionType[] = ['lecture', 'debate', 'persuade', 'write'];

  const canAfford = (cost: number) => gameState.state.energy >= cost;

  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold text-ink text-lg">行动选择</h3>
        <p className="text-sm text-ink/50">选择一个行动来传播你的思想</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((actionType, index) => {
            const config = ACTION_CONFIGS[actionType];
            const Icon = iconMap[config.icon] || BookOpen;
            const affordable = canAfford(config.energyCost);

            return (
              <motion.div
                key={actionType}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => affordable && onAction(actionType)}
                  onMouseEnter={() => setHoveredAction(actionType)}
                  onMouseLeave={() => setHoveredAction(null)}
                  disabled={!affordable}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 transition-all duration-300 text-left',
                    'hover:shadow-lg active:scale-[0.98]',
                    affordable
                      ? 'border-stone-200 bg-white hover:border-stone-300 cursor-pointer'
                      : 'border-stone-100 bg-stone-50 opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${schoolColor}15` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: schoolColor }} />
                    </div>
                    <div className="flex items-center gap-1 text-xs text-ink/50">
                      <Zap className="w-3 h-3" style={{ color: '#F59E0B' }} />
                      {config.energyCost}
                    </div>
                  </div>
                  <h4 className="font-semibold text-ink mb-1">{config.name}</h4>
                  <p className="text-xs text-ink/50 line-clamp-2">{config.description}</p>
                </button>
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {hoveredAction && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 bg-stone-50 rounded-xl">
                <div className="text-sm text-ink/70">
                  <span className="font-medium">成功率：</span>
                  {Math.round(
                    (ACTION_CONFIGS[hoveredAction].baseSuccessRate +
                      (school?.id
                        ? (getSchoolById(school.id) &&
                            Object.values(gameState.rulers).length > 0
                          ? 0
                          : 0)
                        : 0)) *
                      100
                  )}
                  %
                </div>
                <div className="text-xs text-ink/50 mt-1">
                  {ACTION_CONFIGS[hoveredAction].description}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {gameState.abilities.length > 0 && (
          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4" style={{ color: '#7C3AED' }} />
              <h4 className="font-semibold text-ink">独特技能</h4>
            </div>
            <div className="space-y-2">
              {gameState.abilities.map((ability, index) => (
                <AbilityButton
                  key={ability.id}
                  ability={ability}
                  schoolColor={schoolColor}
                  onUse={() => onUseAbility(ability.id)}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>
        )}

        <Button
          className="w-full mt-4 text-lg py-4"
          style={{ backgroundColor: schoolColor }}
          onClick={onEndTurn}
        >
          结束回合
        </Button>
      </CardContent>
    </Card>
  );
};

interface AbilityButtonProps {
  ability: SchoolAbility;
  schoolColor: string;
  onUse: () => void;
  delay: number;
}

const AbilityButton = ({ ability, schoolColor, onUse, delay }: AbilityButtonProps) => {
  const isOnCooldown = ability.currentCooldown > 0;

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={() => !isOnCooldown && onUse()}
      disabled={isOnCooldown}
      className={cn(
        'w-full p-3 rounded-xl text-left transition-all duration-300',
        'flex items-center gap-3',
        isOnCooldown
          ? 'bg-stone-100 opacity-60 cursor-not-allowed'
          : 'bg-gradient-to-r from-purple-50 to-white border border-purple-100 hover:shadow-md cursor-pointer'
      )}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: isOnCooldown ? '#e7e5e4' : `${schoolColor}15`,
        }}
      >
        <Sparkles
          className="w-5 h-5"
          style={{ color: isOnCooldown ? '#a8a29e' : schoolColor }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h5 className="font-semibold text-ink text-sm">{ability.name}</h5>
          {isOnCooldown && (
            <span className="text-xs text-ink/50">冷却 {ability.currentCooldown} 回合</span>
          )}
        </div>
        <p className="text-xs text-ink/50 truncate">{ability.effect}</p>
      </div>
    </motion.button>
  );
};

export default ActionPanel;
