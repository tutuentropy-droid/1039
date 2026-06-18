import { motion } from 'framer-motion';
import { Crown, Users, Zap, Star, Calendar } from 'lucide-react';
import { GameState } from '@/types';
import { Card } from '@/components/ui/Card';
import { getSchoolById } from '@/data/schools';

interface StatusPanelProps {
  gameState: GameState;
}

export const StatusPanel = ({ gameState }: StatusPanelProps) => {
  const school = gameState.playerSchoolId
    ? getSchoolById(gameState.playerSchoolId)
    : null;
  const totalInfluence = Object.values(gameState.state.influence).reduce((a, b) => a + b, 0);
  const supportiveRulers = Object.values(gameState.rulers).filter(
    (r) => r.alignment === 'supportive'
  ).length;

  const statItems = [
    {
      icon: Crown,
      label: '声望',
      value: gameState.state.prestige,
      color: '#D97706',
    },
    {
      icon: Users,
      label: '门徒',
      value: gameState.state.disciples,
      color: '#059669',
    },
    {
      icon: Star,
      label: '总影响力',
      value: totalInfluence,
      color: '#7C3AED',
    },
    {
      icon: Users,
      label: '支持诸侯',
      value: `${supportiveRulers}/${Object.keys(gameState.rulers).length}`,
      color: '#4338CA',
    },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {school && (
            <motion.div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${school.color}20` }}
            >
              <span className="font-bold" style={{ color: school.color }}>
                {school.name.charAt(0)}
              </span>
            </motion.div>
          )}
          <div>
            <h3 className="font-bold text-ink">{school?.name || '未选择学派'}</h3>
            <p className="text-xs text-ink/50">掌门人</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-lg">
          <Calendar className="w-4 h-4 text-ink/50" />
          <span className="text-sm font-medium text-ink">
            第 {gameState.currentTurn}/{gameState.maxTurns} 回合
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4" style={{ color: '#F59E0B' }} />
            <span className="text-sm text-ink/70">体力</span>
          </div>
          <span className="text-sm font-medium text-ink">
            {gameState.state.energy}/{gameState.state.maxEnergy}
          </span>
        </div>
        <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #F59E0B, #D97706)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${(gameState.state.energy / gameState.state.maxEnergy) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-stone-50 rounded-xl p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <item.icon className="w-4 h-4" style={{ color: item.color }} />
              <span className="text-xs text-ink/60">{item.label}</span>
            </div>
            <motion.div
              key={String(item.value)}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-ink"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {item.value}
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-stone-100">
        <div className="text-xs text-ink/50 mb-2">胜利条件</div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${totalInfluence >= 400 ? 'bg-green-500' : 'bg-stone-300'}`} />
            <span className="text-ink/70">总影响力 ≥ 400</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${supportiveRulers >= 4 ? 'bg-green-500' : 'bg-stone-300'}`} />
            <span className="text-ink/70">支持诸侯 ≥ 4</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatusPanel;
