import { motion } from 'framer-motion';
import { Trophy, XCircle, RotateCcw, Crown, Users, Star, Zap } from 'lucide-react';
import { GameState } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getSchoolById } from '@/data/schools';
import { rulers } from '@/data/gameData';
import { RULER_ALIGNMENT_COLORS, RULER_ALIGNMENT_LABELS } from '@/types';

interface GameResultProps {
  gameState: GameState;
  onRestart: () => void;
}

export const GameResult = ({ gameState, onRestart }: GameResultProps) => {
  const isVictory = gameState.gameResult === 'victory';
  const school = gameState.playerSchoolId
    ? getSchoolById(gameState.playerSchoolId)
    : null;

  const totalInfluence = Object.values(gameState.state.influence).reduce((a, b) => a + b, 0);
  const supportiveRulers = Object.values(gameState.rulers).filter(
    (r) => r.alignment === 'supportive'
  ).length;

  const stats = [
    { icon: Crown, label: '最终声望', value: gameState.state.prestige, color: '#D97706' },
    { icon: Users, label: '门徒数量', value: gameState.state.disciples, color: '#059669' },
    { icon: Star, label: '总影响力', value: totalInfluence, color: '#7C3AED' },
    { icon: Users, label: '支持诸侯', value: `${supportiveRulers}/${rulers.length}`, color: '#4338CA' },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-stone-50 to-ochre/10 py-12 px-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="overflow-hidden">
          <div
            className={`p-12 text-center ${
              isVictory
                ? 'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-stone-600 via-stone-500 to-stone-600'
            }`}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4"
            >
              {isVictory ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : (
                <XCircle className="w-12 h-12 text-white" />
              )}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-2"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              {isVictory ? '百家独尊' : '道消势微'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/80 text-lg"
            >
              {school?.name} · {isVictory ? '你的思想已传遍天下' : '你的思想有待后人发扬光大'}
            </motion.p>
          </div>

          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <p className="text-center text-ink/70 leading-relaxed">
                {isVictory
                  ? `恭喜！在${gameState.maxTurns}年的努力下，${school?.name}思想已经深入人心，被${supportiveRulers}个诸侯国所采纳。你的学说将流传千古，成为中华文明的重要组成部分。`
                  : `在${gameState.maxTurns}年的时间里，${school?.name}思想虽然有所传播，但尚未被广泛接受。或许你的学说太过超前，需要时间来证明其价值...`}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="bg-stone-50 rounded-xl p-4 text-center"
                >
                  <div className="w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div className="text-xs text-ink/50 mb-1">{stat.label}</div>
                  <div className="text-2xl font-bold text-ink">{stat.value}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mb-8"
            >
              <h3 className="text-sm font-semibold text-ink/60 mb-3">诸侯国态度</h3>
              <div className="grid grid-cols-7 gap-2">
                {rulers.map((ruler, index) => {
                  const rulerState = gameState.rulers[ruler.id];
                  const color = RULER_ALIGNMENT_COLORS[rulerState?.alignment || 'neutral'];
                  return (
                    <motion.div
                      key={ruler.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + index * 0.05 }}
                      className="text-center"
                    >
                      <div
                        className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-1"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <span className="text-xs font-bold" style={{ color }}>
                          {ruler.stateName.charAt(0)}
                        </span>
                      </div>
                      <div className="text-[10px] text-ink/50">
                        {RULER_ALIGNMENT_LABELS[rulerState?.alignment || 'neutral']}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="flex gap-4"
            >
              <Button
                className="flex-1 text-lg py-4"
                style={{ backgroundColor: school?.color || '#8B4513' }}
                onClick={onRestart}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                重新开始
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default GameResult;
