import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizGameStore } from '@/store/quizGameStore';
import {
  getRandomQuestions,
  getRandomMatchingGame,
  getRandomCategorizationGame,
  getLevelInfo,
  getNewUnlocks,
} from '@/data/quizGameData';
import { QuizGame } from '@/components/quiz/QuizGame';
import { MatchingGame } from '@/components/quiz/MatchingGame';
import { CategorizationGame } from '@/components/quiz/CategorizationGame';
import { PlayerStats } from '@/components/quiz/PlayerStats';
import { UnlockableContent } from '@/components/quiz/UnlockableContent';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  HelpCircle,
  Link2,
  Layers,
  Gauge,
  Sparkles,
  Trophy,
  Star,
  ChevronRight,
  X,
  Award,
  Lock,
} from 'lucide-react';
import { DifficultyLevel, QuizQuestion, MatchingGameData, CategorizationGameData, UnlockableItem } from '@/types';
import { cn } from '@/lib/utils';

type GameMode = 'menu' | 'quiz' | 'matching' | 'categorization';

const difficultyInfo: Record<DifficultyLevel, { name: string; color: string; bgColor: string; questionCount: number }> = {
  easy: { name: '简单', color: 'text-green-600', bgColor: 'bg-green-50 border-green-200', questionCount: 5 },
  medium: { name: '中等', color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-200', questionCount: 8 },
  hard: { name: '困难', color: 'text-red-600', bgColor: 'bg-red-50 border-red-200', questionCount: 10 },
};

const QuizGamePage = () => {
  const navigate = useNavigate();
  const {
    level,
    exp,
    addExp,
    completeQuiz,
    completeMatchingGame,
    completeCategorizationGame,
    updateStreak,
  } = useQuizGameStore();

  const [gameMode, setGameMode] = useState<GameMode>('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('easy');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [matchingGameData, setMatchingGameData] = useState<MatchingGameData | null>(null);
  const [categorizationGameData, setCategorizationGameData] = useState<CategorizationGameData | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [newUnlocks, setNewUnlocks] = useState<UnlockableItem[]>([]);
  const [newLevel, setNewLevel] = useState(1);

  const handleStartQuiz = useCallback(() => {
    const questions = getRandomQuestions(
      difficultyInfo[selectedDifficulty].questionCount,
      selectedDifficulty
    );
    if (questions.length > 0) {
      setQuizQuestions(questions);
      setGameMode('quiz');
      updateStreak();
    }
  }, [selectedDifficulty, updateStreak]);

  const handleStartMatching = useCallback(() => {
    const game = getRandomMatchingGame(selectedDifficulty);
    if (game) {
      setMatchingGameData(game);
      setGameMode('matching');
      updateStreak();
    }
  }, [selectedDifficulty, updateStreak]);

  const handleStartCategorization = useCallback(() => {
    const game = getRandomCategorizationGame(selectedDifficulty);
    if (game) {
      setCategorizationGameData(game);
      setGameMode('categorization');
      updateStreak();
    }
  }, [selectedDifficulty, updateStreak]);

  const handleQuizComplete = useCallback((score: number, totalExp: number, correctCount: number) => {
    const oldLevel = level;
    const { levelUp, newLevel: newLvl, unlockedItems } = addExp(totalExp);
    completeQuiz(`quiz-${selectedDifficulty}-${Date.now()}`, score);
    
    if (levelUp) {
      setNewLevel(newLvl);
      setNewUnlocks(unlockedItems);
      setShowLevelUpModal(true);
    }
  }, [level, selectedDifficulty, addExp, completeQuiz]);

  const handleMatchingComplete = useCallback((score: number, totalExp: number, correctCount: number) => {
    const oldLevel = level;
    const { levelUp, newLevel: newLvl, unlockedItems } = addExp(totalExp);
    completeMatchingGame(matchingGameData?.id || '', score);
    
    if (levelUp) {
      setNewLevel(newLvl);
      setNewUnlocks(unlockedItems);
      setShowLevelUpModal(true);
    }
  }, [level, matchingGameData, addExp, completeMatchingGame]);

  const handleCategorizationComplete = useCallback((score: number, totalExp: number, correctCount: number) => {
    const oldLevel = level;
    const { levelUp, newLevel: newLvl, unlockedItems } = addExp(totalExp);
    completeCategorizationGame(categorizationGameData?.id || '', score);
    
    if (levelUp) {
      setNewLevel(newLvl);
      setNewUnlocks(unlockedItems);
      setShowLevelUpModal(true);
    }
  }, [level, categorizationGameData, addExp, completeCategorizationGame]);

  const handleBackToMenu = useCallback(() => {
    setGameMode('menu');
    setQuizQuestions([]);
    setMatchingGameData(null);
    setCategorizationGameData(null);
  }, []);

  const gameModes = [
    {
      id: 'quiz' as GameMode,
      title: '知识问答',
      description: '回答哲学相关问题，检验你的知识储备',
      icon: HelpCircle,
      color: 'from-ochre to-amber-500',
      iconBg: 'bg-ochre/10 text-ochre',
      action: handleStartQuiz,
    },
    {
      id: 'matching' as GameMode,
      title: '思想连线',
      description: '将哲学家、思想与流派正确配对',
      icon: Link2,
      color: 'from-indigo-cn to-blue-500',
      iconBg: 'bg-indigo-cn/10 text-indigo-cn',
      action: handleStartMatching,
    },
    {
      id: 'categorization' as GameMode,
      title: '流派归类',
      description: '将思想主张归入正确的哲学流派',
      icon: Layers,
      color: 'from-jade to-emerald-500',
      iconBg: 'bg-jade/10 text-jade',
      action: handleStartCategorization,
    },
  ];

  if (gameMode !== 'menu') {
    return (
      <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-stone-50 via-paper to-ochre/5 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {gameMode === 'quiz' && quizQuestions.length > 0 && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <QuizGame
                  questions={quizQuestions}
                  title={`知识问答 - ${difficultyInfo[selectedDifficulty].name}`}
                  onComplete={handleQuizComplete}
                  onBack={handleBackToMenu}
                />
              </motion.div>
            )}

            {gameMode === 'matching' && matchingGameData && (
              <motion.div
                key="matching"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <MatchingGame
                  gameData={matchingGameData}
                  onComplete={handleMatchingComplete}
                  onBack={handleBackToMenu}
                />
              </motion.div>
            )}

            {gameMode === 'categorization' && categorizationGameData && (
              <motion.div
                key="categorization"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CategorizationGame
                  gameData={categorizationGameData}
                  onComplete={handleCategorizationComplete}
                  onBack={handleBackToMenu}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showLevelUpModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-paper rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-ochre/20 to-transparent" />
                
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-ochre to-amber-500 flex items-center justify-center shadow-lg"
                  >
                    <Trophy className="w-12 h-12 text-white" />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-ink mb-2"
                  >
                    升级啦！
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mb-6"
                  >
                    <p className="text-4xl font-bold text-ochre mb-1">
                      Lv.{newLevel}
                    </p>
                    <p className="text-ink/60">
                      {getLevelInfo(exp).level.name}
                    </p>
                  </motion.div>

                  {newUnlocks.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mb-6"
                    >
                      <p className="text-sm font-medium text-ink/70 mb-3">🎉 解锁新内容</p>
                      <div className="space-y-2">
                        {newUnlocks.map((item, idx) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + idx * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-gradient-to-r from-jade/10 to-transparent rounded-lg"
                          >
                            <div className="w-8 h-8 rounded-full bg-jade/20 flex items-center justify-center">
                              <Star className="w-4 h-4 text-jade" />
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-ink text-sm">{item.name}</p>
                              <p className="text-xs text-ink/50">{item.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button onClick={() => setShowLevelUpModal(false)} size="lg">
                      继续努力
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-stone-50 via-paper to-ochre/5 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Badge variant="outline" className="mb-4 border-ochre/30 bg-ochre/5 text-ochre">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            边学边玩，轻松掌握哲学知识
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-3">
            哲学知识闯关
          </h1>
          <p className="text-ink/60 max-w-2xl mx-auto">
            通过答题、连线、归类等趣味游戏，解锁哲学家和历史事件，
            在游戏中提升你的哲学素养
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <PlayerStats />
            <UnlockableContent />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-ochre" />
                    选择难度
                  </CardTitle>
                  <CardDescription>
                    难度越高，获得的经验值越多
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.keys(difficultyInfo) as DifficultyLevel[]).map((diff) => {
                      const info = difficultyInfo[diff];
                      const isSelected = selectedDifficulty === diff;
                      
                      return (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={cn(
                            'p-4 rounded-xl border-2 transition-all text-left',
                            isSelected
                              ? 'border-ochre bg-ochre/10 shadow-md'
                              : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                          )}
                        >
                          <p className={cn('font-semibold', info.color)}>
                            {info.name}
                          </p>
                          <p className="text-xs text-ink/50 mt-1">
                            {info.questionCount} 道题
                          </p>
                          <p className="text-xs text-ochre mt-1">
                            +{info.questionCount * (diff === 'easy' ? 10 : diff === 'medium' ? 20 : 30)} EXP
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-cn" />
                    游戏模式
                  </CardTitle>
                  <CardDescription>
                    选择你喜欢的游戏方式开始挑战
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {gameModes.map((mode, idx) => {
                      const Icon = mode.icon;
                      
                      return (
                        <motion.div
                          key={mode.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          whileHover={{ y: -4 }}
                        >
                          <Card
                            hover
                            className="h-full cursor-pointer"
                            onClick={mode.action}
                          >
                            <CardContent className="p-6 text-center">
                              <div className={cn(
                                'w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center',
                                mode.iconBg
                              )}>
                                <Icon className="w-7 h-7" />
                              </div>
                              <h3 className="font-semibold text-ink mb-2">
                                {mode.title}
                              </h3>
                              <p className="text-sm text-ink/60 mb-4">
                                {mode.description}
                              </p>
                              <Button size="sm" variant="outline" className="w-full">
                                开始挑战
                                <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-jade/5 via-paper to-indigo-cn/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-jade/10 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-6 h-6 text-jade" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-ink">解锁更多内容</h3>
                      <p className="text-sm text-ink/60">
                        完成游戏获得经验值，提升等级以解锁更多哲学家和历史事件
                      </p>
                    </div>
                    <Button onClick={() => navigate('/philosophers')} variant="outline">
                      查看全部
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizGamePage;
