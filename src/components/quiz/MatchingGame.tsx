import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchingGameData, DifficultyLevel } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, RotateCcw, CheckCircle, XCircle, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchingGameProps {
  gameData: MatchingGameData;
  onComplete: (score: number, totalExp: number, correctCount: number) => void;
  onBack: () => void;
}

const difficultyColors: Record<DifficultyLevel, string> = {
  easy: '#10B981',
  medium: '#F59E0B',
  hard: '#EF4444',
};

const difficultyLabels: Record<DifficultyLevel, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

interface Connection {
  leftId: string;
  rightId: string;
  correct: boolean | null;
}

export const MatchingGame = ({ gameData, onComplete, onBack }: MatchingGameProps) => {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalExp, setTotalExp] = useState(0);

  const shuffledRight = useMemo(() => {
    const rightItems = gameData.pairs.map(p => ({ id: p.id, text: p.right, type: p.rightType }));
    return rightItems.sort(() => Math.random() - 0.5);
  }, [gameData]);

  const leftItems = gameData.pairs.map(p => ({ id: p.id, text: p.left, type: p.leftType }));

  const isLeftConnected = (leftId: string) => {
    return connections.some(c => c.leftId === leftId);
  };

  const isRightConnected = (rightId: string) => {
    return connections.some(c => c.rightId === rightId);
  };

  const getConnectionForLeft = (leftId: string): Connection | undefined => {
    return connections.find(c => c.leftId === leftId);
  };

  const getConnectionForRight = (rightId: string): Connection | undefined => {
    return connections.find(c => c.rightId === rightId);
  };

  const handleLeftClick = (id: string) => {
    if (showResult || isLeftConnected(id)) return;
    setSelectedLeft(id);
    
    if (selectedRight) {
      makeConnection(id, selectedRight);
    }
  };

  const handleRightClick = (id: string) => {
    if (showResult || isRightConnected(id)) return;
    setSelectedRight(id);
    
    if (selectedLeft) {
      makeConnection(selectedLeft, id);
    }
  };

  const makeConnection = (leftId: string, rightId: string) => {
    const pair = gameData.pairs.find(p => p.id === leftId);
    const rightItem = shuffledRight.find(r => r.id === rightId);
    const isCorrect = pair && rightItem && pair.id === rightItem.id;

    const newConnection: Connection = {
      leftId,
      rightId,
      correct: null,
    };

    setConnections(prev => [...prev, newConnection]);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const checkAnswers = () => {
    const checkedConnections = connections.map(conn => {
      const pair = gameData.pairs.find(p => p.id === conn.leftId);
      const rightItem = shuffledRight.find(r => r.id === conn.rightId);
      const isCorrect = pair && rightItem && pair.id === rightItem.id;
      return { ...conn, correct: isCorrect };
    });

    const correct = checkedConnections.filter(c => c.correct).length;
    const expGain = Math.round(gameData.expReward * (correct / gameData.pairs.length));

    setConnections(checkedConnections);
    setShowResult(true);
    setCorrectCount(correct);
    setTotalExp(expGain);
  };

  const handleFinish = () => {
    setGameEnded(true);
    onComplete(correctCount * 10, totalExp, correctCount);
  };

  const handleRestart = () => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setConnections([]);
    setShowResult(false);
    setGameEnded(false);
    setCorrectCount(0);
    setTotalExp(0);
  };

  const allConnected = connections.length === gameData.pairs.length;

  if (gameEnded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto"
      >
        <Card className="text-center">
          <CardHeader>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-cn/20 to-indigo-200 flex items-center justify-center">
              <Award className="w-10 h-10 text-indigo-cn" />
            </div>
            <CardTitle className="text-2xl">连线完成！</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-ink">{correctCount}/{gameData.pairs.length}</p>
                <p className="text-sm text-ink/60 mt-1">正确配对</p>
              </div>
              <div className="bg-ochre/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-ochre">+{totalExp}</p>
                <p className="text-sm text-ink/60 mt-1">获得经验</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((correctCount / gameData.pairs.length) * 100)}%
                </p>
                <p className="text-sm text-ink/60 mt-1">正确率</p>
              </div>
            </div>
            <p className="text-ink/70">
              {correctCount === gameData.pairs.length
                ? '完美！全部配对正确，你对哲学知识掌握得很好！'
                : correctCount >= gameData.pairs.length * 0.7
                ? '不错的成绩，继续加油！'
                : '还需努力，多熟悉哲学家和他们的思想吧！'}
            </p>
          </CardContent>
          <CardFooter className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onBack}>
              返回
            </Button>
            <Button onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-2" />
              再来一次
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
            <Link2 className="w-5 h-5 text-indigo-cn" />
            {gameData.title}
          </h2>
          <Badge variant="solid" color={difficultyColors[gameData.difficulty]}>
            {difficultyLabels[gameData.difficulty]}
          </Badge>
        </div>
        <p className="text-ink/60 text-sm">{gameData.description}</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-8">
            <div className="flex-1 space-y-3">
              <p className="text-sm font-medium text-ink/60 mb-3">左侧选项</p>
              {leftItems.map(item => {
                const isSelected = selectedLeft === item.id;
                const isConn = isLeftConnected(item.id);
                const connection = getConnectionForLeft(item.id);
                
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: !isConn && !showResult ? 1.02 : 1 }}
                    whileTap={{ scale: !isConn && !showResult ? 0.98 : 1 }}
                    className={cn(
                      'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                      isSelected && 'border-indigo-cn bg-indigo-cn/10 shadow-md',
                      isConn && connection?.correct === true && 'border-green-500 bg-green-50',
                      isConn && connection?.correct === false && 'border-red-500 bg-red-50',
                      isConn && connection?.correct === null && 'border-stone-300 bg-stone-50',
                      !isConn && !isSelected && !showResult && 'border-stone-200 hover:border-indigo-cn/50 hover:bg-indigo-cn/5',
                      showResult && !isConn && 'opacity-50'
                    )}
                    onClick={() => handleLeftClick(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-ink font-medium">{item.text}</span>
                      {connection?.correct === true && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {connection?.correct === false && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex-1 space-y-3">
              <p className="text-sm font-medium text-ink/60 mb-3">右侧选项</p>
              {shuffledRight.map(item => {
                const isSelected = selectedRight === item.id;
                const isConn = isRightConnected(item.id);
                const connection = getConnectionForRight(item.id);
                
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: !isConn && !showResult ? 1.02 : 1 }}
                    whileTap={{ scale: !isConn && !showResult ? 0.98 : 1 }}
                    className={cn(
                      'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                      isSelected && 'border-indigo-cn bg-indigo-cn/10 shadow-md',
                      isConn && connection?.correct === true && 'border-green-500 bg-green-50',
                      isConn && connection?.correct === false && 'border-red-500 bg-red-50',
                      isConn && connection?.correct === null && 'border-stone-300 bg-stone-50',
                      !isConn && !isSelected && !showResult && 'border-stone-200 hover:border-indigo-cn/50 hover:bg-indigo-cn/5',
                      showResult && !isConn && 'opacity-50'
                    )}
                    onClick={() => handleRightClick(item.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-ink font-medium">{item.text}</span>
                      {connection?.correct === true && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {connection?.correct === false && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-indigo-cn/5 rounded-xl border border-indigo-cn/20"
            >
              <p className="text-ink/70 text-center">
                你已完成 {connections.length} 对连线，正确 {correctCount} 对，
                获得 <span className="font-bold text-ochre">+{totalExp}</span> 经验值
              </p>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={onBack}>
            退出
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4 mr-1" />
              重置
            </Button>
            {!showResult ? (
              <Button onClick={checkAnswers} disabled={!allConnected}>
                提交答案
              </Button>
            ) : (
              <Button onClick={handleFinish}>
                完成
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
