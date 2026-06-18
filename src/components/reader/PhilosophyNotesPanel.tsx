import { useState } from 'react';
import { useReaderStore } from '@/store/readerStore';
import {
  NotebookPen,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Tag,
  Calendar,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Empty } from '@/components/Empty';
import { cn } from '@/lib/utils';
import { PhilosophyNote } from '@/types';

export const PhilosophyNotesPanel = () => {
  const { philosophyNotes, addPhilosophyNote, updatePhilosophyNote, deletePhilosophyNote } =
    useReaderStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  const allTags = Array.from(new Set(philosophyNotes.flatMap((n) => n.tags)));

  const filteredNotes = philosophyNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCreateNote = () => {
    if (!newTitle.trim()) return;

    addPhilosophyNote({
      title: newTitle.trim(),
      content: newContent.trim(),
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });

    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setIsCreating(false);
  };

  const startEdit = (note: PhilosophyNote) => {
    setEditingId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
  };

  const saveEdit = (id: string) => {
    updatePhilosophyNote(id, {
      title: editTitle.trim(),
      content: editContent.trim(),
      tags: editTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setEditingId(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (philosophyNotes.length === 0 && !isCreating) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink">哲学笔记</h3>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ochre text-white rounded-lg text-sm font-medium hover:bg-ochre/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新建笔记
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Empty
            icon={NotebookPen}
            title="暂无哲学笔记"
            description="记录你的思考与感悟，建立个人哲学笔记库"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-stone-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-ink">哲学笔记</h3>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-ochre text-white rounded-lg text-sm font-medium hover:bg-ochre/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            新建笔记
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索笔记..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ochre/50"
            />
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-ink/40" />
            <button
              onClick={() => setSelectedTag(null)}
              className={cn(
                'px-2 py-0.5 text-xs rounded-full transition-colors',
                !selectedTag
                  ? 'bg-ochre/10 text-ochre font-medium'
                  : 'bg-stone-100 text-ink/50 hover:bg-stone-200'
              )}
            >
              全部
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={cn(
                  'px-2 py-0.5 text-xs rounded-full transition-colors',
                  selectedTag === tag
                    ? 'bg-ochre/10 text-ochre font-medium'
                    : 'bg-stone-100 text-ink/50 hover:bg-stone-200'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-gradient-to-br from-ochre/5 to-white rounded-xl border border-ochre/20"
          >
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="笔记标题..."
              className="w-full px-0 py-2 text-lg font-bold text-ink border-0 border-b border-stone-200 focus:outline-none focus:border-ochre/50 bg-transparent mb-3"
              autoFocus
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="写下你的思考与感悟..."
              className="w-full px-3 py-2 text-sm text-ink/70 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ochre/50 resize-none h-32 mb-3"
            />
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-ink/40" />
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="标签（用逗号分隔）"
                className="flex-1 px-2 py-1.5 text-sm border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-ochre/50"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setNewTitle('');
                  setNewContent('');
                  setNewTags('');
                }}
                className="px-4 py-2 text-sm text-ink/60 hover:bg-stone-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateNote}
                disabled={!newTitle.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-ochre text-white rounded-lg text-sm font-medium hover:bg-ochre/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
          </motion.div>
        )}

        {filteredNotes.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-ink/50">没有找到匹配的笔记</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="p-4 bg-paper rounded-xl border border-stone-200/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  {editingId === note.id ? (
                    <div>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-0 py-1 text-lg font-bold text-ink border-0 border-b border-ochre/30 focus:outline-none bg-transparent mb-3"
                        autoFocus
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full px-3 py-2 text-sm text-ink/70 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ochre/50 resize-none h-28 mb-3"
                      />
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-ink/40" />
                        <input
                          type="text"
                          value={editTags}
                          onChange={(e) => setEditTags(e.target.value)}
                          placeholder="标签（用逗号分隔）"
                          className="flex-1 px-2 py-1.5 text-sm border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-ochre/50"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-2 text-ink/50 hover:bg-stone-100 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => saveEdit(note.id)}
                          className="p-2 bg-ochre text-white rounded-lg hover:bg-ochre/90 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-ink text-lg">{note.title}</h4>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEdit(note)}
                            className="p-1.5 text-ink/40 hover:text-indigo-cn hover:bg-indigo-50 rounded-lg transition-colors"
                            title="编辑笔记"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePhilosophyNote(note.id)}
                            className="p-1.5 text-ink/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="删除笔记"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-ink/70 text-sm leading-relaxed whitespace-pre-wrap mb-3">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between">
                        {note.tags.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {note.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-ochre/10 text-ochre text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-ink/40">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(note.updatedAt)}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
