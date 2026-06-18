import { useState } from 'react';
import { ClassicBook, ClassicChapter } from '@/types';
import { useReaderStore } from '@/store/readerStore';
import { X, Send, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnnotationPanelProps {
  book: ClassicBook;
  chapter: ClassicChapter;
  lineIndex: number;
  onClose: () => void;
}

export const AnnotationPanel = ({ book, chapter, lineIndex, onClose }: AnnotationPanelProps) => {
  const { annotations, addAnnotation, deleteAnnotation, getAnnotationsByChapter } = useReaderStore();
  const [newAnnotation, setNewAnnotation] = useState('');

  const lineAnnotations = annotations.filter(
    (a) => a.bookId === book.id && a.chapterId === chapter.id && a.lineIndex === lineIndex
  );

  const handleAddAnnotation = () => {
    if (!newAnnotation.trim()) return;

    addAnnotation({
      bookId: book.id,
      chapterId: chapter.id,
      lineIndex,
      text: newAnnotation.trim(),
    });

    setNewAnnotation('');
  };

  const originalText = chapter.original[lineIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="border-t border-stone-200 bg-white"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-ink">批注</h4>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-stone-100 text-ink/50 hover:text-ink transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-3 p-3 bg-stone-50 rounded-lg text-sm text-ink/70 italic">
            「{originalText}」
          </div>

          {lineAnnotations.length > 0 && (
            <div className="mb-3 space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
              {lineAnnotations.map((annotation) => (
                <div
                  key={annotation.id}
                  className="p-2.5 bg-indigo-50/60 rounded-lg text-sm text-ink/70 flex items-start gap-2"
                >
                  <p className="flex-1">{annotation.text}</p>
                  <button
                    onClick={() => deleteAnnotation(annotation.id)}
                    className="p-1 text-ink/30 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newAnnotation}
              onChange={(e) => setNewAnnotation(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddAnnotation();
                }
              }}
              placeholder="添加你的批注..."
              className="flex-1 px-3 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ochre/50 bg-white"
            />
            <button
              onClick={handleAddAnnotation}
              disabled={!newAnnotation.trim()}
              className="px-4 py-2 bg-ochre text-white rounded-lg text-sm font-medium hover:bg-ochre/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
