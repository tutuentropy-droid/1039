import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, Users, BookOpen, Clock, Star } from 'lucide-react';
import { MapNode, MapLocation, MAP_NODE_TYPE_COLORS, MAP_NODE_TYPE_LABELS } from '@/types';
import { mapLocations, getLocationById } from '@/data/mapData';
import { getSchoolById } from '@/data/schools';
import { getPhilosopherById } from '@/data/philosophers';
import { cn } from '@/lib/utils';

interface ChinaMapProps {
  nodes: MapNode[];
  currentYear?: number;
  isPlaying?: boolean;
  onNodeClick?: (node: MapNode, location: MapLocation) => void;
  selectedNodeId?: string | null;
}

const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

const MIN_LNG = 100;
const MAX_LNG = 128;
const MIN_LAT = 20;
const MAX_LAT = 42;

const lngToX = (lng: number): number => {
  const range = MAX_LNG - MIN_LNG;
  return ((lng - MIN_LNG) / range) * MAP_WIDTH;
};

const latToY = (lat: number): number => {
  const range = MAX_LAT - MIN_LAT;
  return MAP_HEIGHT - ((lat - MIN_LAT) / range) * MAP_HEIGHT;
};

export const ChinaMap = ({
  nodes,
  currentYear,
  isPlaying = false,
  onNodeClick,
  selectedNodeId,
}: ChinaMapProps) => {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const nodesByLocation = useMemo(() => {
    const grouped: Record<string, MapNode[]> = {};
    nodes.forEach((node) => {
      if (!grouped[node.locationId]) {
        grouped[node.locationId] = [];
      }
      grouped[node.locationId].push(node);
    });
    return grouped;
  }, [nodes]);

  const isNodeActive = useCallback(
    (node: MapNode): boolean => {
      if (currentYear === undefined) return true;
      return node.year <= currentYear;
    },
    [currentYear]
  );

  const handleNodeHover = (nodeId: string, e: React.MouseEvent) => {
    setHoveredNodeId(nodeId);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
  };

  const handleNodeLeave = () => {
    setHoveredNodeId(null);
  };

  const handleNodeClick = (node: MapNode) => {
    if (!isNodeActive(node)) return;
    const location = getLocationById(node.locationId);
    if (location && onNodeClick) {
      onNodeClick(node, location);
    }
  };

  const hoveredNode = hoveredNodeId ? nodes.find((n) => n.id === hoveredNodeId) : null;
  const hoveredLocation = hoveredNode ? getLocationById(hoveredNode.locationId) : null;

  return (
    <div className="relative w-full">
      <div className="relative bg-gradient-to-br from-stone-50 to-ochre/5 rounded-2xl border border-stone-200 overflow-hidden shadow-inner">
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full h-auto"
          style={{ maxHeight: '600px' }}
        >
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(139, 69, 19, 0.05)"
                strokeWidth="1"
              />
            </pattern>
          </defs>

          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#gridPattern)" />
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#mapGlow)" />

          <g className="china-outline">
            <path
              d="M 280,60 Q 340,40 400,50 Q 460,60 520,50 Q 570,40 610,55 Q 650,70 680,95 Q 710,120 730,150 Q 745,180 755,210 Q 765,240 770,270 Q 775,300 770,330 Q 765,360 755,385 Q 745,410 730,430 Q 715,450 695,465 Q 675,480 655,490 Q 635,500 615,505 Q 595,510 575,515 Q 555,520 535,525 Q 515,530 495,535 Q 475,540 455,543 Q 435,546 415,543 Q 395,540 375,533 Q 355,526 335,515 Q 315,504 295,490 Q 275,476 255,460 Q 235,444 220,425 Q 205,406 190,385 Q 175,364 165,340 Q 155,316 150,290 Q 145,264 150,238 Q 155,212 165,188 Q 175,164 190,142 Q 205,120 220,100 Q 240,80 260,70 Q 270,65 280,60 Z"
              fill="rgba(217, 119, 6, 0.08)"
              stroke="rgba(139, 69, 19, 0.3)"
              strokeWidth="2"
              strokeDasharray="0"
            />
          </g>

          <g className="province-lines" stroke="rgba(139, 69, 19, 0.15)" strokeWidth="1" fill="none">
            <path d="M 320,100 Q 350,140 370,180 Q 390,220 380,260" />
            <path d="M 420,80 Q 440,120 460,160 Q 480,200 470,240" />
            <path d="M 500,70 Q 520,110 540,150 Q 560,190 550,230" />
            <path d="M 580,80 Q 600,120 620,160 Q 640,200 630,240" />
            <path d="M 280,200 Q 320,220 360,240 Q 400,260 420,280" />
            <path d="M 420,260 Q 460,280 500,300 Q 540,320 560,340" />
            <path d="M 550,270 Q 580,290 610,310 Q 640,330 670,350" />
            <path d="M 320,310 Q 360,330 400,350 Q 440,370 460,390" />
            <path d="M 470,350 Q 510,370 550,390 Q 590,410 610,430" />
            <path d="M 580,380 Q 610,400 640,420 Q 670,440 700,460" />
          </g>

          <g className="rivers" stroke="rgba(30, 77, 107, 0.2)" strokeWidth="2.5" fill="none">
            <path d="M 260,260 Q 310,280 360,300 Q 410,320 460,330 Q 510,340 560,350 Q 610,360 660,380 Q 710,400 760,430" />
            <path d="M 360,130 Q 410,160 460,200 Q 510,240 540,280 Q 570,320 600,360 Q 630,400 660,450" />
          </g>

          {mapLocations.map((location) => {
            const locationNodes = nodesByLocation[location.id] || [];
            if (locationNodes.length === 0) return null;

            const x = lngToX(location.lng);
            const y = latToY(location.lat);

            const activeNodes = locationNodes.filter((n) => isNodeActive(n));
            if (activeNodes.length === 0) return null;

            const primaryNode = activeNodes[0];
            const nodeCount = activeNodes.length;

            const isSelected = selectedNodeId && activeNodes.some((n) => n.id === selectedNodeId);

            return (
              <g key={location.id} transform={`translate(${x}, ${y})`}>
                <motion.circle
                  r={isSelected ? 12 : 8}
                  fill={MAP_NODE_TYPE_COLORS[primaryNode.type]}
                  filter={isSelected ? 'url(#glow)' : undefined}
                  className="cursor-pointer"
                  whileHover={{ r: isSelected ? 14 : 10 }}
                  onClick={() => handleNodeClick(primaryNode)}
                  onMouseEnter={(e) => handleNodeHover(primaryNode.id, e)}
                  onMouseLeave={handleNodeLeave}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />

                <motion.circle
                  r={isSelected ? 16 : 12}
                  fill="none"
                  stroke={MAP_NODE_TYPE_COLORS[primaryNode.type]}
                  strokeWidth="2"
                  opacity={0.4}
                  className="pointer-events-none"
                  animate={{
                    r: isSelected ? [12, 18, 12] : [8, 14, 8],
                    opacity: isSelected ? [0.6, 0, 0.6] : [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {nodeCount > 1 && (
                  <g transform="translate(10, -10)">
                    <circle r="8" fill="#fff" stroke={MAP_NODE_TYPE_COLORS[primaryNode.type]} strokeWidth="1.5" />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="10"
                      fontWeight="bold"
                      fill={MAP_NODE_TYPE_COLORS[primaryNode.type]}
                    >
                      {nodeCount}
                    </text>
                  </g>
                )}

                <text
                  x="0"
                  y="24"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#44403c"
                  className="pointer-events-none select-none"
                  style={{ fontWeight: 500 }}
                >
                  {location.name}
                </text>
              </g>
            );
          })}

          {isPlaying && currentYear !== undefined && (
            <g>
              {nodes
                .filter((n) => n.year === currentYear)
                .map((node) => {
                  const location = getLocationById(node.locationId);
                  if (!location) return null;
                  const x = lngToX(location.lng);
                  const y = latToY(location.lat);

                  return (
                    <motion.g
                      key={`pulse-${node.id}`}
                      transform={`translate(${x}, ${y})`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 2, 0], opacity: [0.8, 0.4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <circle r="20" fill="none" stroke="#D97706" strokeWidth="3" />
                    </motion.g>
                  );
                })}
            </g>
          )}
        </svg>

        <AnimatePresence>
          {hoveredNode && hoveredLocation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-50 pointer-events-none"
              style={{
                left: `${(tooltipPosition.x / (typeof window !== 'undefined' ? window.innerWidth : 1000)) * 100}%`,
                top: 'auto',
                bottom: '100%',
                transform: 'translateX(-50%)',
                marginTop: '12px',
              }}
            >
              <div className="bg-white rounded-xl shadow-xl border border-stone-200 p-4 max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: MAP_NODE_TYPE_COLORS[hoveredNode.type] }}
                  />
                  <span className="text-xs font-medium text-ink/60">
                    {MAP_NODE_TYPE_LABELS[hoveredNode.type]}
                  </span>
                </div>
                <h4 className="font-bold text-ink mb-1">{hoveredNode.title}</h4>
                <div className="flex items-center gap-1 text-xs text-ink/50 mb-2">
                  <Clock className="w-3 h-3" />
                  {hoveredNode.yearLabel}
                </div>
                <p className="text-sm text-ink/70 line-clamp-2">{hoveredNode.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {hoveredNode.relatedIdeas.slice(0, 3).map((idea) => (
                    <span
                      key={idea}
                      className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full"
                    >
                      {idea}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        {Object.entries(MAP_NODE_TYPE_LABELS).map(([type, label]) => (
          <div key={type} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: MAP_NODE_TYPE_COLORS[type as keyof typeof MAP_NODE_TYPE_COLORS] }}
            />
            <span className="text-sm text-ink/60">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChinaMap;
