import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Clock,
} from 'lucide-react';
import { DynastyPeriod, DYNASTY_OPTIONS, DynastyOption } from '@/types';
import { cn } from '@/lib/utils';

interface MapTimelineProps {
  currentYear: number;
  minYear: number;
  maxYear: number;
  isPlaying: boolean;
  playSpeed: number;
  selectedPeriod: DynastyPeriod;
  onYearChange: (year: number) => void;
  onPlayToggle: () => void;
  onSpeedChange: (speed: number) => void;
  onPeriodChange: (period: DynastyPeriod) => void;
}

const SPEED_OPTIONS = [
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '2x', value: 2 },
  { label: '4x', value: 4 },
];

const formatYear = (year: number): string => {
  if (year < 0) {
    return `前${Math.abs(year)}年`;
  }
  return `${year}年`;
};

export const MapTimeline = ({
  currentYear,
  minYear,
  maxYear,
  isPlaying,
  playSpeed,
  selectedPeriod,
  onYearChange,
  onPlayToggle,
  onSpeedChange,
  onPeriodChange,
}: MapTimelineProps) => {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const currentPeriod = useMemo(() => {
    return DYNASTY_OPTIONS.find((d) => d.id === selectedPeriod);
  }, [selectedPeriod]);

  const progressPercent = useMemo(() => {
    const range = maxYear - minYear;
    return ((currentYear - minYear) / range) * 100;
  }, [currentYear, minYear, maxYear]);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      onYearChange(value);
    },
    [onYearChange]
  );

  const handleSkipBack = useCallback(() => {
    onYearChange(minYear);
  }, [minYear, onYearChange]);

  const handleSkipForward = useCallback(() => {
    onYearChange(maxYear);
  }, [maxYear, onYearChange]);

  const handlePrevPeriod = useCallback(() => {
    const currentIndex = DYNASTY_OPTIONS.findIndex((d) => d.id === selectedPeriod);
    if (currentIndex > 0) {
      const prevPeriod = DYNASTY_OPTIONS[currentIndex - 1];
      onPeriodChange(prevPeriod.id);
      onYearChange(prevPeriod.startYear);
    }
  }, [selectedPeriod, onPeriodChange, onYearChange]);

  const handleNextPeriod = useCallback(() => {
    const currentIndex = DYNASTY_OPTIONS.findIndex((d) => d.id === selectedPeriod);
    if (currentIndex < DYNASTY_OPTIONS.length - 1) {
      const nextPeriod = DYNASTY_OPTIONS[currentIndex + 1];
      onPeriodChange(nextPeriod.id);
      onYearChange(nextPeriod.startYear);
    }
  }, [selectedPeriod, onPeriodChange, onYearChange]);

  const isFirstPeriod = selectedPeriod === DYNASTY_OPTIONS[0].id;
  const isLastPeriod = selectedPeriod === DYNASTY_OPTIONS[DYNASTY_OPTIONS.length - 1].id;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-ochre" />
          <h3 className="font-bold text-ink">历史时间轴</h3>
        </div>

        <div className="text-right">
          <motion.div
            key={currentYear}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-ink"
          >
            {formatYear(currentYear)}
          </motion.div>
          {currentPeriod && currentPeriod.id !== 'all' && (
            <div className="text-xs text-ink/50">{currentPeriod.name}时期</div>
          )}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-sm font-medium text-ink/60 mb-2">朝代切换</div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPeriod}
            disabled={isFirstPeriod}
            className={cn(
              'p-2 rounded-lg transition-all',
              isFirstPeriod
                ? 'text-stone-300 cursor-not-allowed'
                : 'text-ink/60 hover:bg-stone-100 hover:text-ink'
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 flex gap-1 overflow-x-auto py-1">
            {DYNASTY_OPTIONS.map((dynasty) => (
              <button
                key={dynasty.id}
                onClick={() => {
                  onPeriodChange(dynasty.id);
                  onYearChange(dynasty.startYear);
                }}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                  selectedPeriod === dynasty.id
                    ? 'bg-ink text-paper shadow-md'
                    : 'bg-stone-100 text-ink/60 hover:bg-stone-200 hover:text-ink'
                )}
              >
                {dynasty.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPeriod}
            disabled={isLastPeriod}
            className={cn(
              'p-2 rounded-lg transition-all',
              isLastPeriod
                ? 'text-stone-300 cursor-not-allowed'
                : 'text-ink/60 hover:bg-stone-100 hover:text-ink'
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mb-5">
        <div className="relative">
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #D97706 0%, #7C3AED 100%)',
              }}
            />
          </div>

          <input
            type="range"
            min={minYear}
            max={maxYear}
            value={currentYear}
            onChange={handleSliderChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="flex justify-between mt-2 text-xs text-ink/40">
            <span>{formatYear(minYear)}</span>
            <span>{formatYear(maxYear)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleSkipBack}
          className="p-2 rounded-lg text-ink/60 hover:bg-stone-100 hover:text-ink transition-colors"
          title="回到开始"
        >
          <SkipBack className="w-5 h-5" />
        </button>

        <motion.button
          onClick={onPlayToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-ochre to-indigo-cn flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
        </motion.button>

        <button
          onClick={handleSkipForward}
          className="p-2 rounded-lg text-ink/60 hover:bg-stone-100 hover:text-ink transition-colors"
          title="跳到末尾"
        >
          <SkipForward className="w-5 h-5" />
        </button>

        <div className="w-px h-8 bg-stone-200 mx-2" />

        <div className="relative">
          <button
            onClick={() => setShowSpeedMenu(!showSpeedMenu)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-100 text-ink/70 hover:bg-stone-200 hover:text-ink transition-colors"
          >
            <Gauge className="w-4 h-4" />
            <span className="text-sm font-medium">{playSpeed}x</span>
          </button>

          {showSpeedMenu && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-10">
              {SPEED_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    onSpeedChange(opt.value);
                    setShowSpeedMenu(false);
                  }}
                  className={cn(
                    'w-full px-4 py-2 text-sm text-left transition-colors',
                    playSpeed === opt.value
                      ? 'bg-ochre/10 text-ochre font-medium'
                      : 'text-ink/70 hover:bg-stone-50'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-stone-100">
        <div className="text-xs text-ink/40 text-center">
          拖动滑块或点击播放，动态查看哲学思想的历史演变
        </div>
      </div>
    </div>
  );
};

export default MapTimeline;
