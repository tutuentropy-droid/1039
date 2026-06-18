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

const lngToX = (lng: number): number => {
  const minLng = 73;
  const maxLng = 135;
  const range = maxLng - minLng;
  return ((lng - minLng) / range) * MAP_WIDTH;
};

const latToY = (lat: number): number => {
  const minLat = 18;
  const maxLat = 54;
  const range = maxLat - minLat;
  return MAP_HEIGHT - ((lat - minLat) / range) * MAP_HEIGHT;
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

  const getNodeOpacity = useCallback(
    (node: MapNode): number => {
      if (currentYear === undefined) return 1;
      return node.year <= currentYear ? 1 : 0.2;
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
              d="M 180,80 Q 220,60 280,70 Q 340,80 400,65 Q 460,50 520,70 Q 560,90 590,120 Q 620,150 640,180 Q 660,210 680,240 Q 700,270 720,300 Q 740,330 750,360 Q 760,390 755,420 Q 750,450 735,470 Q 720,490 700,500 Q 680,510 660,520 Q 640,530 620,535 Q 600,540 580,545 Q 560,550 540,555 Q 520,560 500,565 Q 480,570 460,572 Q 440,574 420,570 Q 400,566 380,560 Q 360,554 340,545 Q 320,536 300,525 Q 280,514 260,500 Q 240,486 220,470 Q 200,454 185,435 Q 170,416 155,395 Q 140,374 130,350 Q 120,326 115,300 Q 110,274 115,248 Q 120,222 130,198 Q 140,174 155,152 Q 170,130 180,110 Q 175,95 180,80 Z"
              fill="rgba(217, 119, 6, 0.08)"
              stroke="rgba(139, 69, 19, 0.3)"
              strokeWidth="2"
              strokeDasharray="0"
            />
          </g>

          <g className="province-lines" stroke="rgba(139, 69, 19, 0.15)" strokeWidth="1" fill="none">
            <path d="M 250,120 Q 280,160 300,200 Q 320,240 310,280" />
            <path d="M 350,100 Q 370,140 390,180 Q 410,220 400,260" />
            <path d="M 450,90 Q 470,130 490,170 Q 510,210 500,250" />
            <path d="M 550,110 Q 570,150 580,190 Q 590,230 580,270" />
            <path d="M 200,220 Q 240,240 280,260 Q 320,280 340,300" />
            <path d="M 350,280 Q 390,300 430,320 Q 470,340 490,360" />
            <path d="M 500,290 Q 530,310 560,330 Q 590,350 620,370" />
            <path d="M 250,350 Q 290,370 330,390 Q 370,410 390,430" />
            <path d="M 400,380 Q 440,400 480,420 Q 520,440 540,460" />
            <path d="M 550,400 Q 580,420 610,440 Q 640,460 670,480" />
          </g>

          <g className="rivers" stroke="rgba(30, 77, 107, 0.2)" strokeWidth="2" fill="none">
            <path d="M 200,280 Q 250,300 300,320 Q 350,340 400,350 Q 450,360 500,370 Q 550,380 600,400 Q 650,420 700,450" />
            <path d="M 300,150 Q 350,180 400,220 Q 450,260 480,300 Q 510,340 540,380 Q 570,420 600,470" />
          </g>

          {mapLocations.map((location) => {
            const locationNodes = nodesByLocation[location.id] || [];
            if (locationNodes.length === 0) return null;

            const x = lngToX(location.lng);
            const y = latToY(location.lat);

            const hasActiveNode = locationNodes.some((n) => getNodeOpacity(n) > 0.5);
            const primaryNode = locationNodes[0];
            const nodeCount = locationNodes.length;

            const isSelected = selectedNodeId && locationNodes.some((n) => n.id === selectedNodeId);

            return (
              <g key={location.id} transform={`translate(${x}, ${y})`}>
                <motion.circle
                  r={isSelected ? 12 : 8}
                  fill={MAP_NODE_TYPE_COLORS[primaryNode.type]}
                  opacity={hasActiveNode ? 1 : 0.3}
                  filter={isSelected ? 'url(#glow)' : undefined}
                  className="cursor-pointer"
                  whileHover={{ r: isSelected ? 14 : 10 }}
                  onClick={() => handleNodeClick(primaryNode)}
                  onMouseEnter={(e) => handleNodeHover(primaryNode.id, e)}
                  onMouseLeave={handleNodeLeave}
                />

                <motion.circle
                  r={isSelected ? 16 : 12}
                  fill="none"
                  stroke={MAP_NODE_TYPE_COLORS[primaryNode.type]}
                  strokeWidth="2"
                  opacity={hasActiveNode ? 0.4 : 0.1}
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
