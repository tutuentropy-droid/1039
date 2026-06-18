import { useState } from 'react';
import { useReaderStore } from '@/store/readerStore';
import { getClassicById } from '@/data/classics';
import { Star, Trash2, Edit3, Save, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Empty } from '@/components/Empty';
import { cn } from '@/lib/utils';

export const GoldenQuotesPanel = () => {
  const { goldenQuotes, removeGoldenQuote, updateGoldenQuoteNote } = useReaderStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  const startEdit = (id: string, currentNote?: string) => {
    setEditingId(id);
    setEditNote(currentNote || '');
  };

  const saveEdit = (id: string) => {
    updateGoldenQuoteNote(id, editNote);
    setEditingId(null);
  };

  const getBookTitle = (bookId: string) => {
    const book = getClassicById(bookId);
    return book?.title || '未知典籍';
  };

  const getChapterTitle = (bookId: string, chapterId: string) => {
    const book = getClassicById(bookId);
    const chapter = book?.chapters.find((c) => c.id === chapterId);
    return chapter?.title || '未知章节';
  };

  if (goldenQuotes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Empty
          icon={Star}
          title="暂无收藏金句"
          description="在阅读时点击星标按钮，收藏你喜欢的金句"
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-ink">我的金句收藏</h3>
          <span className="text-sm text-ink/50">共 {goldenQuotes.length} 句</span>
        </div>

        <AnimatePresence initial={false}>
          {goldenQuotes.map((quote, index) => (
            <motion.div
              key={quote.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative p-5 bg-gradient-to-br from-amber-50/80 to-white rounded-xl border border-amber-200/60 shadow-sm"
            >
              <div className="absolute top-4 right-4 flex items-center gap-1">
                <button
                  onClick={() => startEdit(quote.id, quote.note)}
                  className="p-1.5 rounded-lg text-ink/40 hover:text-indigo-cn hover:bg-indigo-50 transition-colors"
                  title="添加笔记"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeGoldenQuote(quote.id)}
                  className="p-1.5 rounded-lg text-ink/40 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="移除收藏"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-3">
                <div className="flex items-center gap-1.5 text-amber-600 mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-medium">金句</span>
                </div>
                <p className="text-ink font-medium leading-relaxed text-lg">
                  「{quote.originalText}」
                </p>
              </div>

              <p className="text-ink/60 text-sm leading-relaxed mb-3">
                {quote.translationText}
              </p>

              {editingId === quote.id ? (
                <div className="mt-3 pt-3 border-t border-amber-200/60">
                  <div className="flex items-start gap-2">
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="写下你的感悟..."
                      className="flex-1 px-3 py-2 text-sm border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50 resize-none h-20"
                      autoFocus
                    />
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => saveEdit(quote.id)}
                        className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 bg-stone-100 text-ink/50 rounded-lg hover:bg-stone-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : quote.note ? (
                <div className="mt-3 pt-3 border-t border-amber-200/60">
                  <p className="text-sm text-indigo-cn italic">
                    📝 {quote.note}
                  </p>
                </div>
              ) : null}

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-amber-200/40">
                <BookOpen className="w-3.5 h-3.5 text-ochre" />
                <span className="text-xs text-ink/50">
                  {getBookTitle(quote.bookId)} · {getChapterTitle(quote.bookId, quote.chapterId)}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
