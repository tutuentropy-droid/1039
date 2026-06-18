import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategorizationGameData, DifficultyLevel } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, RotateCcw, CheckCircle, XCircle, Layers, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategorizationGameProps {
  gameData: CategorizationGameData;
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

interface CategorizedItem {
  itemId: string;
  categoryId: string;
  correct: boolean | null;
}

const categoryColors = [
  '#F59E0B',
  '#3B82F6',
  '#10B981',
  '#8B5CF6',
  '#EF4444',
  '#EC4899',
];

export const CategorizationGame = ({ gameData, onComplete, onBack }: CategorizationGameProps) => {
  const [categorizedItems, setCategorizedItems] = useState<CategorizedItem[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalExp, setTotalExp] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const shuffledItems = useMemo(() => {
    return [...gameData.items].sort(() => Math.random() - 0.5);
  }, [gameData]);

  const uncategorizedItems = shuffledItems.filter(
    item => !categorizedItems.some(c => c.itemId === item.id)
  );

  const getItemsInCategory = (categoryId: string) => {
    return categorizedItems
      .filter(c => c.categoryId === categoryId)
      .map(c => {
        const item = gameData.items.find(i => i.id === c.itemId);
        return { ...item, ...c };
      });
  };

  const handleDragStart = (itemId: string) => {
    if (showResult) return;
    setDraggedItem(itemId);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (categoryId: string) => {
    if (!draggedItem || showResult) return;

    const existingIndex = categorizedItems.findIndex(c => c.itemId === draggedItem);
    
    if (existingIndex >= 0) {
      const newItems = [...categorizedItems];
      newItems[existingIndex].categoryId = categoryId;
      setCategorizedItems(newItems);
    } else {
      setCategorizedItems(prev => [...prev, {
        itemId: draggedItem,
        categoryId,
        correct: null,
      }]);
    }
    
    setDraggedItem(null);
  };

  const handleRemoveItem = (itemId: string) => {
    if (showResult) return;
    setCategorizedItems(prev => prev.filter(c => c.itemId !== itemId));
  };

  const handleItemClick = (itemId: string, categoryId?: string) => {
    if (showResult) return;
    
    if (categoryId) {
      handleRemoveItem(itemId);
    } else {
      setDraggedItem(itemId);
    }
  };

  const checkAnswers = () => {
    const checkedItems = categorizedItems.map(c => {
      const item = gameData.items.find(i => i.id === c.itemId);
      const isCorrect = item && item.correctCategory === c.categoryId;
      return { ...c, correct: isCorrect };
    });

    const correct = checkedItems.filter(c => c.correct).length;
    const expGain = Math.round(gameData.expReward * (correct / gameData.items.length));

    setCategorizedItems(checkedItems);
    setShowResult(true);
    setCorrectCount(correct);
    setTotalExp(expGain);
  };

  const handleFinish = () => {
    setGameEnded(true);
    onComplete(correctCount * 10, totalExp, correctCount);
  };

  const handleRestart = () => {
    setCategorizedItems([]);
    setShowResult(false);
    setGameEnded(false);
    setCorrectCount(0);
    setTotalExp(0);
    setDraggedItem(null);
  };

  const allCategorized = categorizedItems.length === gameData.items.length;

  if (gameEnded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto"
      >
        <Card className="text-center">
          <CardHeader>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-jade/20 to-emerald-200 flex items-center justify-center">
              <Award className="w-10 h-10 text-jade" />
            </div>
            <CardTitle className="text-2xl">归类完成！</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-ink">{correctCount}/{gameData.items.length}</p>
                <p className="text-sm text-ink/60 mt-1">正确归类</p>
              </div>
              <div className="bg-ochre/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-ochre">+{totalExp}</p>
                <p className="text-sm text-ink/60 mt-1">获得经验</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((correctCount / gameData.items.length) * 100)}%
                </p>
                <p className="text-sm text-ink/60 mt-1">正确率</p>
              </div>
            </div>
            <p className="text-ink/70">
              {correctCount === gameData.items.length
                ? '太棒了！全部归类正确，你对诸子百家了如指掌！'
                : correctCount >= gameData.items.length * 0.7
                ? '不错的成绩，继续加油！'
                : '还需努力，多了解各流派的特点吧！'}
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
      className="max-w-4xl mx-auto"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-ink flex items-center gap-2">
            <Layers className="w-5 h-5 text-jade" />
            {gameData.title}
          </h2>
          <Badge variant="solid" color={difficultyColors[gameData.difficulty]}>
            {difficultyLabels[gameData.difficulty]}
          </Badge>
        </div>
        <p className="text-ink/60 text-sm">{gameData.description}</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div>
            <p className="text-sm font-medium text-ink/60 mb-3">
              待归类项目 ({uncategorizedItems.length})
            </p>
            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 bg-stone-50 rounded-xl border-2 border-dashed border-stone-200">
              {uncategorizedItems.map(item => (
                <motion.div
                  key={item.id}
                  draggable={!showResult}
                  onDragStart={() => handleDragStart(item.id)}
                  onDragEnd={handleDragEnd}
                  whileHover={{ scale: !showResult ? 1.05 : 1 }}
                  whileTap={{ scale: !showResult ? 0.95 : 1 }}
                  className={cn(
                    'px-4 py-2 bg-white rounded-lg border-2 cursor-move shadow-sm transition-all',
                    draggedItem === item.id ? 'border-ochre bg-ochre/10 shadow-md scale-105' : 'border-stone-200 hover:border-stone-300',
                    showResult && 'cursor-default'
                  )}
                  onClick={() => handleItemClick(item.id)}
                >
                  <span className="text-ink font-medium text-sm">{item.text}</span>
                </motion.div>
              ))}
              {uncategorizedItems.length === 0 && (
                <p className="text-ink/40 text-sm w-full text-center py-2">
                  所有项目已归类
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4" style={{
            gridTemplateColumns: `repeat(${Math.min(gameData.categories.length, 3)}, 1fr)`
          }}>
            {gameData.categories.map((category, idx) => {
              const items = getItemsInCategory(category.id);
              const color = categoryColors[idx % categoryColors.length];
              const isDragOver = draggedItem !== null;
              
              return (
                <div
                  key={category.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(category.id)}
                  className={cn(
                    'min-h-[120px] p-4 rounded-xl border-2 transition-all duration-200',
                    isDragOver ? 'border-dashed scale-[1.02]' : 'border-solid',
                    isDragOver ? 'border-ochre bg-ochre/5' : 'border-stone-200 bg-white'
                  )}
                >
                  <div
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 text-white"
                    style={{ backgroundColor: color }}
                  >
                    {category.name}
                  </div>
                  
                  <div className="space-y-2">
                    <AnimatePresence>
                      {items.map(item => (
                        <motion.div
                          key={item.itemId}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={cn(
                            'flex items-center justify-between p-2 rounded-lg border text-sm',
                            item.correct === true && 'border-green-300 bg-green-50',
                            item.correct === false && 'border-red-300 bg-red-50',
                            item.correct === null && 'border-stone-200 bg-stone-50'
                          )}
                        >
                          <span className="text-ink flex-1">{item.text}</span>
                          {!showResult && (
                            <button
                              onClick={() => handleRemoveItem(item.itemId)}
                              className="ml-2 p-0.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                          {item.correct === true && <CheckCircle className="w-4 h-4 text-green-500 ml-2" />}
                          {item.correct === false && <XCircle className="w-4 h-4 text-red-500 ml-2" />}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {items.length === 0 && (
                      <p className="text-ink/30 text-xs text-center py-2">
                        拖拽项目到此处
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {showResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-jade/5 rounded-xl border border-jade/20"
            >
              <p className="text-ink/70 text-center">
                你已归类 {categorizedItems.length} 个项目，正确 {correctCount} 个，
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
              <Button onClick={checkAnswers} disabled={!allCategorized}>
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
