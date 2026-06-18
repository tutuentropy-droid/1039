import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Crown, X, Check, Minus } from 'lucide-react';
import { GameState, RULER_ALIGNMENT_LABELS, RULER_ALIGNMENT_COLORS } from '@/types';
import { rulers, getRulerById } from '@/data/gameData';
import { getLocationById } from '@/data/mapData';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getSchoolById } from '@/data/schools';

const MAP_WIDTH = 800;
const MAP_HEIGHT = 500;

const MIN_LNG = 105;
const MAX_LNG = 125;
const MIN_LAT = 30;
const MAX_LAT = 40;

const lngToX = (lng: number): number => {
  const range = MAX_LNG - MIN_LNG;
  return ((lng - MIN_LNG) / range) * MAP_WIDTH;
};

const latToY = (lat: number): number => {
  const range = MAX_LAT - MIN_LAT;
  return MAP_HEIGHT - ((lat - MIN_LAT) / range) * MAP_HEIGHT;
};

interface GameMapProps {
  gameState: GameState;
  onSelectRuler: (rulerId: string) => void;
}

export const GameMap = ({ gameState, onSelectRuler }: GameMapProps) => {
  const school = gameState.playerSchoolId
    ? getSchoolById(gameState.playerSchoolId)
    : null;

  const selectedRuler = gameState.selectedRulerId
    ? getRulerById(gameState.selectedRulerId)
    : null;
  const selectedRulerState = gameState.selectedRulerId
    ? gameState.rulers[gameState.selectedRulerId]
    : null;

  const alignmentIcon = {
    supportive: Check,
    neutral: Minus,
    opposed: X,
  };

  const rulerNodes = useMemo(() => {
    return rulers.map((ruler) => {
      const location = getLocationById(ruler.locationId);
      if (!location) return null;

      const rulerState = gameState.rulers[ruler.id];
      const x = lngToX(location.lng);
      const y = latToY(location.lat);
      const isSelected = gameState.selectedRulerId === ruler.id;
      const AlignmentIcon = alignmentIcon[rulerState?.alignment || 'neutral'];

      return {
        ruler,
        location,
        rulerState,
        x,
        y,
        isSelected,
        AlignmentIcon,
      };
    }).filter(Boolean);
  }, [gameState.rulers, gameState.selectedRulerId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <h3 className="font-bold text-ink text-lg">战国形势图</h3>
            <p className="text-sm text-ink/50">点击诸侯国选择游说目标</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative bg-gradient-to-br from-stone-50 to-ochre/5 rounded-xl overflow-hidden">
              <svg
                viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                className="w-full h-auto"
                style={{ maxHeight: '450px' }}
              >
                <defs>
                  <pattern id="gameGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(139, 69, 19, 0.05)"
                      strokeWidth="1"
                    />
                  </pattern>
                  <filter id="gameGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#gameGrid)" />

                <g className="china-outline">
                  <path
                    d="M 100,50 Q 180,30 260,40 Q 340,50 420,40 Q 500,30 560,50 Q 620,70 670,100 Q 720,130 740,180 Q 760,230 750,280 Q 740,330 720,370 Q 700,400 660,420 Q 620,440 580,450 Q 540,460 500,465 Q 460,470 420,470 Q 380,470 340,460 Q 300,450 260,430 Q 220,410 190,380 Q 160,350 140,310 Q 120,270 115,220 Q 110,170 120,120 Q 130,80 150,60 Q 170,45 100,50 Z"
                    fill="rgba(217, 119, 6, 0.08)"
                    stroke="rgba(139, 69, 19, 0.3)"
                    strokeWidth="2"
                  />
                </g>

                <g className="rivers" stroke="rgba(30, 77, 107, 0.15)" strokeWidth="2" fill="none">
                  <path d="M 150,250 Q 250,270 350,290 Q 450,310 550,320 Q 650,330 750,350" />
                  <path d="M 300,100 Q 380,140 460,190 Q 540,240 600,300 Q 660,360 700,420" />
                </g>

                {rulerNodes.map((node, index) => {
                  if (!node) return null;
                  const { ruler, rulerState, x, y, isSelected, AlignmentIcon } = node;
                  const color = RULER_ALIGNMENT_COLORS[rulerState?.alignment || 'neutral'];
                  const influence = rulerState?.influence || 0;

                  return (
                    <g key={ruler.id} transform={`translate(${x}, ${y})`}>
                      <motion.circle
                        r={isSelected ? 22 : 16}
                        fill={color}
                        fillOpacity={0.2}
                        stroke={color}
                        strokeWidth={2}
                        className="cursor-pointer"
                        filter={isSelected ? 'url(#gameGlow)' : undefined}
                        whileHover={{ r: isSelected ? 26 : 20 }}
                        onClick={() => onSelectRuler(ruler.id)}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                      />
                      
                      <motion.circle
                        r={isSelected ? 14 : 10}
                        fill={color}
                        className="cursor-pointer pointer-events-none"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.05 }}
                      />

                      <foreignObject x={-12} y={-12} width={24} height={24} className="pointer-events-none">
                        <div className="w-full h-full flex items-center justify-center">
                          <AlignmentIcon className="w-4 h-4 text-white" strokeWidth={3} />
                        </div>
                      </foreignObject>

                      <motion.circle
                        r={isSelected ? 30 : 22}
                        fill="none"
                        stroke={color}
                        strokeWidth="1"
                        opacity={0.3}
                        className="pointer-events-none"
                        animate={{
                          r: isSelected ? [22, 36, 22] : [16, 28, 16],
                          opacity: isSelected ? [0.5, 0, 0.5] : [0.3, 0, 0.3],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      />

                      <text
                        x="0"
                        y={isSelected ? 40 : 32}
                        textAnchor="middle"
                        fontSize="12"
                        fill="#44403c"
                        fontWeight="600"
                        className="pointer-events-none select-none"
                      >
                        {ruler.stateName}
                      </text>

                      {isSelected && (
                        <g>
                          <foreignObject x={-40} y={isSelected ? 46 : 38} width={80} height={8}>
                            <div className="w-full h-full bg-stone-200 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${influence}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </foreignObject>
                          <text
                            x="0"
                            y={isSelected ? 70 : 60}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#78716c"
                            className="pointer-events-none select-none"
                          >
                            影响力 {influence}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="px-6 pb-4 pt-2 flex flex-wrap gap-4 justify-center">
              {Object.entries(RULER_ALIGNMENT_LABELS).map(([type, label]) => {
                const Icon = alignmentIcon[type as keyof typeof alignmentIcon];
                return (
                  <div key={type} className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: RULER_ALIGNMENT_COLORS[type as keyof typeof RULER_ALIGNMENT_COLORS] }}
                    >
                      <Icon className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                    <span className="text-sm text-ink/60">{label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {selectedRuler && selectedRulerState && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${RULER_ALIGNMENT_COLORS[selectedRulerState.alignment]}20` }}
                >
                  <Crown className="w-6 h-6" style={{ color: RULER_ALIGNMENT_COLORS[selectedRulerState.alignment] }} />
                </div>
                <div>
                  <h3 className="font-bold text-ink text-lg">{selectedRuler.name}</h3>
                  <p className="text-sm text-ink/50">{selectedRuler.stateName}国君</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-ink/70 leading-relaxed mb-3">
                  {selectedRuler.description}
                </p>
                
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-ink/60">对你的态度</span>
                  <span
                    className="text-sm font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${RULER_ALIGNMENT_COLORS[selectedRulerState.alignment]}20`,
                      color: RULER_ALIGNMENT_COLORS[selectedRulerState.alignment],
                    }}
                  >
                    {RULER_ALIGNMENT_LABELS[selectedRulerState.alignment]}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-ink/50">影响力</span>
                    <span className="text-xs font-medium text-ink">
                      {selectedRulerState.influence}/100
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: RULER_ALIGNMENT_COLORS[selectedRulerState.alignment],
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedRulerState.influence}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectedRuler.tendencies.map((tendency) => (
                    <span
                      key={tendency}
                      className="text-xs px-2 py-1 bg-stone-100 text-ink/60 rounded-md"
                    >
                      {tendency}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <h3 className="font-bold text-ink text-lg">诸侯国列表</h3>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1">
              {rulers.map((ruler) => {
                const rulerState = gameState.rulers[ruler.id];
                const isSelected = gameState.selectedRulerId === ruler.id;
                const AlignmentIcon = alignmentIcon[rulerState?.alignment || 'neutral'];
                const color = RULER_ALIGNMENT_COLORS[rulerState?.alignment || 'neutral'];

                return (
                  <button
                    key={ruler.id}
                    onClick={() => onSelectRuler(ruler.id)}
                    className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-stone-100 shadow-sm'
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <AlignmentIcon className="w-4 h-4" style={{ color }} strokeWidth={3} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-medium text-ink truncate">
                        {ruler.stateName} - {ruler.name}
                      </div>
                      <div className="text-xs text-ink/50 truncate">
                        国力 {ruler.power} · 影响力 {rulerState?.influence || 0}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GameMap;
