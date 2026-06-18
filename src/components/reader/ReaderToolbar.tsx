import { useReaderStore } from '@/store/readerStore';
import {
  BookOpen,
  AlignLeft,
  Highlighter,
  Type,
  Star,
  NotebookPen,
  BookMarked,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReaderToolbarProps {
  activeTab: 'reader' | 'quotes' | 'notes';
  onTabChange: (tab: 'reader' | 'quotes' | 'notes') => void;
}

export const ReaderToolbar = ({ activeTab, onTabChange }: ReaderToolbarProps) => {
  const {
    showOriginal,
    showTranslation,
    fontSize,
    highlightKeywords,
    setShowOriginal,
    setShowTranslation,
    setFontSize,
    setHighlightKeywords,
  } = useReaderStore();

  const tabs = [
    { id: 'reader' as const, label: '阅读', icon: BookOpen },
    { id: 'quotes' as const, label: '金句收藏', icon: Star },
    { id: 'notes' as const, label: '哲学笔记', icon: NotebookPen },
  ];

  return (
    <div className="border-b border-stone-200 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-white text-ink shadow-sm'
                  : 'text-ink/60 hover:text-ink'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'reader' && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink/50">显示</span>
              <button
                onClick={() => setShowOriginal(!showOriginal)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
                  showOriginal
                    ? 'bg-ochre/10 text-ochre'
                    : 'bg-stone-100 text-ink/50 hover:text-ink/70'
                )}
              >
                <BookMarked className="w-3.5 h-3.5" />
                原文
              </button>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
                  showTranslation
                    ? 'bg-indigo-cn/10 text-indigo-cn'
                    : 'bg-stone-100 text-ink/50 hover:text-ink/70'
                )}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                译文
              </button>
            </div>

            <div className="w-px h-6 bg-stone-200" />

            <div className="flex items-center gap-2">
              <span className="text-xs text-ink/50">字号</span>
              <button
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                className="w-7 h-7 rounded-md bg-stone-100 flex items-center justify-center text-ink/70 hover:bg-stone-200 transition-colors"
              >
                <Type className="w-3.5 h-3.5 scale-75" />
              </button>
              <span className="text-xs text-ink/70 w-6 text-center">{fontSize}</span>
              <button
                onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                className="w-7 h-7 rounded-md bg-stone-100 flex items-center justify-center text-ink/70 hover:bg-stone-200 transition-colors"
              >
                <Type className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="w-px h-6 bg-stone-200" />

            <button
              onClick={() => setHighlightKeywords(!highlightKeywords)}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all',
                highlightKeywords
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-stone-100 text-ink/50 hover:text-ink/70'
              )}
            >
              <Highlighter className="w-3.5 h-3.5" />
              关键词高亮
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
