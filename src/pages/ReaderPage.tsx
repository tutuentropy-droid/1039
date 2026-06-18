import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classics, getClassicById } from '@/data/classics';
import { ClassicBook } from '@/types';
import { ChapterList } from '@/components/reader/ChapterList';
import { ReadingContent } from '@/components/reader/ReadingContent';
import { ReaderToolbar } from '@/components/reader/ReaderToolbar';
import { GoldenQuotesPanel } from '@/components/reader/GoldenQuotesPanel';
import { PhilosophyNotesPanel } from '@/components/reader/PhilosophyNotesPanel';
import { BookOpen, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const categoryLabels: Record<ClassicBook['category'], string> = {
  confucian: '儒家',
  taoist: '道家',
  mohist: '墨家',
  legalist: '法家',
  other: '其他',
};

const categoryColors: Record<ClassicBook['category'], string> = {
  confucian: 'from-ochre to-amber-600',
  taoist: 'from-jade to-emerald-600',
  mohist: 'from-indigo-cn to-blue-600',
  legalist: 'from-cinnabar to-red-600',
  other: 'from-stone-500 to-stone-700',
};

const ReaderPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'reader' | 'quotes' | 'notes'>('reader');
  const [currentBookId, setCurrentBookId] = useState<string | null>(bookId || null);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);

  const currentBook = currentBookId ? getClassicById(currentBookId) : null;

  const currentChapter = currentBook?.chapters.find((c) => c.id === currentChapterId);

  const handleSelectBook = (id: string) => {
    setCurrentBookId(id);
    const book = getClassicById(id);
    if (book && book.chapters.length > 0) {
      setCurrentChapterId(book.chapters[0].id);
    }
    setActiveTab('reader');
    navigate(`/reader/${id}`, { replace: true });
  };

  const handlePrevChapter = () => {
    if (!currentBook || !currentChapter) return;
    const currentIndex = currentBook.chapters.findIndex((c) => c.id === currentChapter.id);
    if (currentIndex > 0) {
      setCurrentChapterId(currentBook.chapters[currentIndex - 1].id);
    }
  };

  const handleNextChapter = () => {
    if (!currentBook || !currentChapter) return;
    const currentIndex = currentBook.chapters.findIndex((c) => c.id === currentChapter.id);
    if (currentIndex < currentBook.chapters.length - 1) {
      setCurrentChapterId(currentBook.chapters[currentIndex + 1].id);
    }
  };

  const hasPrev =
    currentBook && currentChapter
      ? currentBook.chapters.findIndex((c) => c.id === currentChapter.id) > 0
      : false;
  const hasNext =
    currentBook && currentChapter
      ? currentBook.chapters.findIndex((c) => c.id === currentChapter.id) <
        currentBook.chapters.length - 1
      : false;

  if (!currentBook || !currentChapter) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-ink mb-2">经典著作</h1>
            <p className="text-ink/60">选择一部典籍开始研读，直抵先贤智慧的本源</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {classics.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover onClick={() => handleSelectBook(book.id)} className="h-full">
                  <CardContent className="p-6">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${categoryColors[book.category]} flex items-center justify-center mb-4 shadow-lg`}
                    >
                      <BookOpen className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-ink mb-2">{book.title}</h3>
                    <p className="text-sm text-ink/60 mb-3 line-clamp-3">{book.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {categoryLabels[book.category]}
                      </Badge>
                      <span className="text-xs text-ink/40">
                        {book.chapters.length} 章
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 bg-gradient-to-br from-ochre/10 to-indigo-cn/10 rounded-2xl border border-ochre/20"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-ochre/20 flex items-center justify-center flex-shrink-0">
                <Library className="w-6 h-6 text-ochre" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink mb-2">阅读特色功能</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-ink/70">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-ochre" />
                    原文白话文对照阅读
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-cn" />
                    关键词智能高亮
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cinnabar" />
                    收藏金句与批注
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-jade" />
                    个人哲学笔记库
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold" />
                    字号自由调节
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-stone-500" />
                    数据本地持久化
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex bg-paper">
      <div className="w-72 flex-shrink-0 border-r border-stone-200 bg-white/50">
        <ChapterList
          book={currentBook}
          currentChapterId={currentChapterId}
          onSelectChapter={setCurrentChapterId}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <ReaderToolbar activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="flex-1 min-h-0 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'reader' && currentChapter && (
              <motion.div
                key="reader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <ReadingContent
                  book={currentBook}
                  chapter={currentChapter}
                  onPrevChapter={handlePrevChapter}
                  onNextChapter={handleNextChapter}
                  hasPrev={hasPrev}
                  hasNext={hasNext}
                />
              </motion.div>
            )}

            {activeTab === 'quotes' && (
              <motion.div
                key="quotes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <GoldenQuotesPanel />
              </motion.div>
            )}

            {activeTab === 'notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <PhilosophyNotesPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ReaderPage;
