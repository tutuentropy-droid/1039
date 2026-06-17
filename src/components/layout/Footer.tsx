import { Github, Heart, BookOpen } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-stone-200/60 bg-gradient-to-b from-paper/50 to-stone-50/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-ochre" />
              <span className="font-bold text-ink">中国哲学探索平台</span>
            </div>
            <p className="text-sm text-ink/60 leading-relaxed">
              以可视化方式探索从先秦到宋明的中国哲学思想演变，感受中华智慧的博大精深。
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-ink">主要流派</h4>
            <div className="flex flex-wrap gap-2">
              {['儒家', '道家', '法家', '墨家', '名家', '阴阳家', '玄学', '理学', '心学'].map((school) => (
                <span
                  key={school}
                  className="px-2 py-1 text-xs bg-stone-100 text-ink/70 rounded-full hover:bg-stone-200 transition-colors cursor-default"
                >
                  {school}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-ink">关于</h4>
            <p className="text-sm text-ink/60">
              本站为中国哲学学习与探索平台，旨在通过现代技术传承和弘扬中华传统文化。
            </p>
            <div className="flex items-center gap-2 text-xs text-ink/50">
              <span>以</span>
              <Heart className="w-3.5 h-3.5 text-vermilion animate-pulse" />
              <span>传承中华文化</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-200/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink/50">
            © 2024 中国哲学探索平台 · 弘扬传统文化，传承先贤智慧
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-xs text-ink/50 hover:text-ink transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              源码
            </a>
            <span className="text-xs text-ink/30">|</span>
            <a href="#" className="text-xs text-ink/50 hover:text-ink transition-colors">
              使用说明
            </a>
            <span className="text-xs text-ink/30">|</span>
            <a href="#" className="text-xs text-ink/50 hover:text-ink transition-colors">
              联系我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
