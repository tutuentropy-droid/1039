import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizQuestion, DifficultyLevel } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight, CheckCircle, XCircle, Award, RotateCcw, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizGameProps {
  questions: QuizQuestion[];
  title?: string;
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

export const QuizGame = ({ questions, title = '知识问答', onComplete, onBack }: QuizGameProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [totalExp, setTotalExp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [answered, setAnswered] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const isCorrect = (): boolean => {
    if (selectedAnswers.length !== currentQuestion.correctAnswers.length) return false;
    const sortedSelected = [...selectedAnswers].sort();
    const sortedCorrect = [...currentQuestion.correctAnswers].sort();
    return sortedSelected.every((val, idx) => val === sortedCorrect[idx]);
  };

  const handleSelectAnswer = (index: number) => {
    if (answered) return;

    if (currentQuestion.type === 'single' || currentQuestion.type === 'truefalse') {
      setSelectedAnswers([index]);
    } else {
      setSelectedAnswers((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    }
  };

  const handleSubmit = useCallback(() => {
    if (selectedAnswers.length === 0) return;
    
    const correct = isCorrect();
    setAnswered(true);
    setShowResult(true);
    
    if (correct) {
      const expGain = currentQuestion.expReward;
      setScore((prev) => prev + currentQuestion.expReward);
      setTotalExp((prev) => prev + expGain);
      setCorrectCount((prev) => prev + 1);
    }
  }, [selectedAnswers, currentQuestion, isCorrect]);

  const handleNext = () => {
    if (isLastQuestion) {
      setGameEnded(true);
      onComplete(score, totalExp, correctCount);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswers([]);
      setShowResult(false);
      setShowExplanation(false);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswers([]);
    setShowResult(false);
    setShowExplanation(false);
    setScore(0);
    setTotalExp(0);
    setCorrectCount(0);
    setGameEnded(false);
    setAnswered(false);
  };

  const getOptionStyle = (index: number) => {
    const isSelected = selectedAnswers.includes(index);
    const isCorrectAnswer = currentQuestion.correctAnswers.includes(index);

    if (!showResult) {
      return cn(
        'border-2 rounded-xl p-4 cursor-pointer transition-all duration-200',
        isSelected
          ? 'border-ochre bg-ochre/10 shadow-md'
          : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
      );
    }

    if (isCorrectAnswer) {
      return 'border-2 border-green-500 bg-green-50 rounded-xl p-4';
    }

    if (isSelected && !isCorrectAnswer) {
      return 'border-2 border-red-500 bg-red-50 rounded-xl p-4';
    }

    return 'border-2 border-stone-200 rounded-xl p-4 opacity-60';
  };

  if (gameEnded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto"
      >
        <Card className="text-center">
          <CardHeader>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-ochre/20 to-amber-200 flex items-center justify-center">
              <Award className="w-10 h-10 text-ochre" />
            </div>
            <CardTitle className="text-2xl">答题完成！</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-ink">{correctCount}/{questions.length}</p>
                <p className="text-sm text-ink/60 mt-1">正确题数</p>
              </div>
              <div className="bg-ochre/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-ochre">+{totalExp}</p>
                <p className="text-sm text-ink/60 mt-1">获得经验</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((correctCount / questions.length) * 100)}%
                </p>
                <p className="text-sm text-ink/60 mt-1">正确率</p>
              </div>
            </div>
            <p className="text-ink/70">
              {correctCount === questions.length
                ? '太棒了！全部答对，你真是哲学天才！'
                : correctCount >= questions.length * 0.7
                ? '不错的成绩，继续加油！'
                : '还需努力，多学习哲学知识吧！'}
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
      className="max-w-2xl mx-auto"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-ink">{title}</h2>
          <Badge variant="solid" color={difficultyColors[currentQuestion.difficulty]}>
            {difficultyLabels[currentQuestion.difficulty]}
          </Badge>
        </div>
        <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-ochre to-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-sm text-ink/60 mt-2">
          第 {currentIndex + 1} / {questions.length} 题
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-ink mb-6">
                {currentQuestion.question}
                {currentQuestion.type === 'multiple' && (
                  <span className="text-sm font-normal text-ink/60 ml-2">
                    （多选）
                  </span>
                )}
              </h3>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: !answered ? 1.01 : 1 }}
                    whileTap={{ scale: !answered ? 0.99 : 1 }}
                    className={getOptionStyle(index)}
                    onClick={() => handleSelectAnswer(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-sm font-medium',
                          selectedAnswers.includes(index)
                            ? 'border-ochre bg-ochre text-white'
                            : 'border-stone-300 text-ink/60',
                          showResult && currentQuestion.correctAnswers.includes(index)
                            ? 'border-green-500 bg-green-500 text-white'
                            : '',
                          showResult && selectedAnswers.includes(index) && !currentQuestion.correctAnswers.includes(index)
                            ? 'border-red-500 bg-red-500 text-white'
                            : ''
                        )}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-ink flex-1">{option}</span>
                      {showResult && currentQuestion.correctAnswers.includes(index) && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                      {showResult && selectedAnswers.includes(index) && !currentQuestion.correctAnswers.includes(index) && (
                        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6"
                >
                  <div
                    className={cn(
                      'p-4 rounded-xl',
                      isCorrect() ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect() ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-700">回答正确！</span>
                          <Badge variant="solid" color="#10B981" className="ml-auto">
                            +{currentQuestion.expReward} EXP
                          </Badge>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-600" />
                          <span className="font-semibold text-red-700">回答错误</span>
                        </>
                      )}
                    </div>

                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 pt-3 border-t border-current/10"
                      >
                        <p className="text-sm text-ink/70 leading-relaxed">
                          <Lightbulb className="w-4 h-4 inline mr-1.5 text-amber-500" />
                          {currentQuestion.explanation}
                        </p>
                      </motion.div>
                    )}

                    {!showExplanation && (
                      <button
                        onClick={() => setShowExplanation(true)}
                        className="text-sm text-ink/60 hover:text-ink/80 mt-2 flex items-center gap-1"
                      >
                        <Lightbulb className="w-4 h-4" />
                        查看解析
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={onBack}>
            退出
          </Button>
          {!answered ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswers.length === 0}
            >
              提交答案
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {isLastQuestion ? '查看结果' : '下一题'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};
