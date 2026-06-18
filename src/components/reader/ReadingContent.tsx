import { useState } from 'react';
import { ClassicChapter, ClassicBook } from '@/types';
import { useReaderStore } from '@/store/readerStore';
import { cn } from '@/lib/utils';
import {
  Star,
  StarOff,
  MessageSquarePlus,
  AlignLeft,
  BookOpen,
  Highlighter,
  Type,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AnnotationPanel } from './AnnotationPanel';

interface ReadingContentProps {
  book: ClassicBook;
  chapter: ClassicChapter;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export const ReadingContent = ({
  book,
  chapter,
  onPrevChapter,
  onNextChapter,
  hasPrev,
  hasNext,
}: ReadingContentProps) => {
  const {
    showOriginal,
    showTranslation,
    fontSize,
    highlightKeywords,
    addGoldenQuote,
    removeGoldenQuote,
    isGoldenQuote,
    annotations,
  } = useReaderStore();

  const [selectedLineIndex, setSelectedLineIndex] = useState<number | null>(null);
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);

  const getHighlightedText = (text: string, keywords?: string[]) => {
    if (!highlightKeywords || !keywords || keywords.length === 0) {
      return text;
    }

    let result = text;
    const usedKeywords: string[] = [];

    keywords.forEach((keyword) => {
      if (result.includes(keyword) && !usedKeywords.some(k => k.includes(keyword) || keyword.includes(k))) {
        const regex = new RegExp(`(${keyword})`, 'g');
        result = result.replace(regex, '|||HIGHLIGHT|||$1|||/HIGHLIGHT|||');
        usedKeywords.push(keyword);
      }
    });

    return result;
  };

  const renderHighlightedText = (text: string, keywords?: string[]) => {
    const highlighted = getHighlightedText(text, keywords);
    if (!highlighted.includes('|||HIGHLIGHT|||')) {
      return text;
    }

    const parts = highlighted.split(/\|\|\|(?:HIGHLIGHT|\/HIGHLIGHT)\|\|\|/);
    return parts.map((part, index) =>
      index % 2 === 1 ? (
        <mark
          key={index}
          className="bg-amber-200/60 text-ink px-0.5 rounded font-medium"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleToggleQuote = (lineIndex: number) => {
    const originalText = chapter.original[lineIndex];
    const translationText = chapter.translation[lineIndex];

    if (isGoldenQuote(book.id, chapter.id, originalText)) {
      const quote = useReaderStore
        .getState()
        .goldenQuotes.find(
          (q) =>
            q.bookId === book.id &&
            q.chapterId === chapter.id &&
            q.originalText === originalText
        );
      if (quote) {
        removeGoldenQuote(quote.id);
      }
    } else {
      addGoldenQuote({
        bookId: book.id,
        chapterId: chapter.id,
        originalText,
        translationText,
      });
    }
  };

  const handleAddAnnotation = (lineIndex: number) => {
    setSelectedLineIndex(lineIndex);
    setShowAnnotationPanel(true);
  };

  const chapterAnnotations = annotations.filter(
    (a) => a.bookId === book.id && a.chapterId === chapter.id
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">{chapter.title}</h2>
          <p className="text-sm text-ink/50">
            {book.title} · 第 {chapter.chapterNumber} 章
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrevChapter}
            disabled={!hasPrev}
            className={cn(
              'p-2 rounded-lg transition-colors',
              hasPrev
                ? 'hover:bg-stone-100 text-ink/70 hover:text-ink'
                : 'text-stone-300 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-ink/50 min-w-[80px] text-center">
            {chapter.chapterNumber} / {book.chapters.length}
          </span>
          <button
            onClick={onNextChapter}
            disabled={!hasNext}
            className={cn(
              'p-2 rounded-lg transition-colors',
              hasNext
                ? 'hover:bg-stone-100 text-ink/70 hover:text-ink'
                : 'text-stone-300 cursor-not-allowed'
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {chapter.keywords && chapter.keywords.length > 0 && (
        <div className="px-6 py-3 bg-amber-50/50 border-b border-amber-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-amber-700 flex items-center gap-1">
              <Highlighter className="w-3.5 h-3.5" />
              关键词：
            </span>
            {chapter.keywords.map((keyword) => (
              <span
                key={keyword}
                className="px-2 py-0.5 bg-amber-100/80 text-amber-800 text-xs rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div
          className="max-w-3xl mx-auto p-6 space-y-6"
          style={{ fontSize: `${fontSize}px` }}
        >
          {chapter.original.map((line, lineIndex) => {
            const isQuoted = isGoldenQuote(book.id, chapter.id, line);
            const lineAnnotations = chapterAnnotations.filter(
              (a) => a.lineIndex === lineIndex
            );

            return (
              <div
                key={lineIndex}
                className={cn(
                  'group relative p-4 rounded-xl transition-all duration-200',
                  'hover:bg-stone-50/50',
                  isQuoted && 'bg-amber-50/60 border border-amber-200/60'
                )}
              >
                <div className="absolute right-3 top-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleToggleQuote(lineIndex)}
                    className={cn(
                      'p-1.5 rounded-lg transition-colors',
                      isQuoted
                        ? 'text-amber-500 bg-amber-50'
                        : 'text-ink/40 hover:text-amber-500 hover:bg-amber-50'
                    )}
                    title={isQuoted ? '取消收藏' : '收藏金句'}
                  >
                    {isQuoted ? (
                      <Star className="w-4 h-4 fill-current" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleAddAnnotation(lineIndex)}
                    className="p-1.5 rounded-lg text-ink/40 hover:text-indigo-cn hover:bg-indigo-50 transition-colors"
                    title="添加批注"
                  >
                    <MessageSquarePlus className="w-4 h-4" />
                  </button>
                </div>

                {showOriginal && (
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="flex items-center gap-1 text-xs font-medium text-ochre">
                        <BookOpen className="w-3.5 h-3.5" />
                        原文
                      </span>
                    </div>
                    <p className="text-ink leading-relaxed font-medium">
                      {renderHighlightedText(line, chapter.keywords)}
                    </p>
                  </div>
                )}

                {showTranslation && (
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="flex items-center gap-1 text-xs font-medium text-indigo-cn">
                        <AlignLeft className="w-3.5 h-3.5" />
                        译文
                      </span>
                    </div>
                    <p className="text-ink/70 leading-relaxed">
                      {showOriginal
                        ? chapter.translation[lineIndex]
                        : renderHighlightedText(
                            chapter.translation[lineIndex],
                            chapter.keywords
                          )}
                    </p>
                  </div>
                )}

                {lineAnnotations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-200/60">
                    {lineAnnotations.map((annotation) => (
                      <div
                        key={annotation.id}
                        className="flex items-start gap-2 p-2 bg-indigo-50/60 rounded-lg mb-2 last:mb-0"
                      >
                        <Type className="w-4 h-4 text-indigo-cn mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-ink/70">{annotation.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showAnnotationPanel && selectedLineIndex !== null && (
        <AnnotationPanel
          book={book}
          chapter={chapter}
          lineIndex={selectedLineIndex}
          onClose={() => {
            setShowAnnotationPanel(false);
            setSelectedLineIndex(null);
          }}
        />
      )}
    </div>
  );
};
