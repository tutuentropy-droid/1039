import { Link, useLocation } from 'react-router-dom';
import { Search, BookOpen, Network, Home, Menu, X, Users, Clock, Scale } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/philosophers', label: '人物图谱', icon: Users },
    { path: '/timeline', label: '历史时间轴', icon: Clock },
    { path: '/relations', label: '思想关系', icon: Network },
    { path: '/compare', label: '观点对比', icon: Scale },
  ];

  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-ink to-ochre flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <BookOpen className="w-5 h-5 text-paper" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-vermilion rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                道
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-ink tracking-tight">中国哲学</h1>
              <p className="text-xs text-ink/50">思想演化探索平台</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  location.pathname === item.path
                    ? 'bg-ink text-paper shadow-md'
                    : 'text-ink/70 hover:text-ink hover:bg-stone-100'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
              <input
                type="text"
                placeholder="搜索流派、人物..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-stone-100/50 border border-stone-200 rounded-lg text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ochre/50 focus:bg-paper transition-all"
              />
            </div>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5 text-ink" /> : <Menu className="w-5 h-5 text-ink" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-stone-200/60 bg-paper"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    location.pathname === item.path
                      ? 'bg-ink text-paper'
                      : 'text-ink/70 hover:bg-stone-100'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40" />
                <input
                  type="text"
                  placeholder="搜索流派、人物..."
                  className="w-full pl-10 pr-4 py-3 bg-stone-100/50 border border-stone-200 rounded-lg text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-ochre/50"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
