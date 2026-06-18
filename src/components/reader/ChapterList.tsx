import { ClassicBook, ClassicChapter } from '@/types';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronRight } from 'lucide-react';

interface ChapterListProps {
  book: ClassicBook;
  currentChapterId: string;
  onSelectChapter: (chapterId: string) => void;
}

export const ChapterList = ({ book, currentChapterId, onSelectChapter }: ChapterListProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ochre to-amber-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-ink">{book.title}</h3>
            <p className="text-xs text-ink/50">{book.author} · {book.dynasty}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        <p className="px-3 py-2 text-xs font-medium text-ink/50 uppercase tracking-wider">
          目录
        </p>
        {book.chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onSelectChapter(chapter.id)}
            className={cn(
              'w-full text-left px-3 py-2.5 rounded-lg mb-1 transition-all duration-200',
              'flex items-center justify-between group',
              currentChapterId === chapter.id
                ? 'bg-ochre/10 text-ochre font-medium'
                : 'text-ink/70 hover:bg-stone-100 hover:text-ink'
            )}
          >
            <span className="flex items-center gap-2">
              <span className={cn(
                'w-6 h-6 rounded flex items-center justify-center text-xs font-medium',
                currentChapterId === chapter.id
                  ? 'bg-ochre text-white'
                  : 'bg-stone-200 text-ink/50'
              )}>
                {chapter.chapterNumber}
              </span>
              <span>{chapter.title}</span>
            </span>
            <ChevronRight className={cn(
              'w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity',
              currentChapterId === chapter.id && 'opacity-100'
            )} />
          </button>
        ))}
      </div>
    </div>
  );
};
