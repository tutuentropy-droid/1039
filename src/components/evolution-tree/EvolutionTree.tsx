import { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';
import { useEvolutionTree } from '@/hooks/useEvolutionTree';
import { TreeNode } from './TreeNode';
import { TreeLink } from './TreeLink';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DYNASTY_OPTIONS, DynastyPeriod } from '@/types';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

interface EvolutionTreeProps {
  onSchoolSelect?: (schoolId: string) => void;
}

export const EvolutionTree = ({ onSchoolSelect }: EvolutionTreeProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { selectedPeriod, setSelectedPeriod } = useAppStore();

  const {
    allNodes,
    links,
    filteredSchools,
    selectedSchool,
    hoveredNode,
    zoom,
    pan,
    handleNodeClick,
    handleNodeHover,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
  } = useEvolutionTree();

  const svgWidth = 1300;
  const svgHeight = 900;

  const isHighlighted = useCallback(
    (nodeId: string) => {
      if (!hoveredNode && !selectedSchool) return true;
      if (selectedSchool?.id === nodeId) return true;
      if (hoveredNode === nodeId) return true;

      const selectedId = selectedSchool?.id || hoveredNode;
      if (!selectedId) return true;

      const selectedNode = allNodes.find((n) => n.id === selectedId);
      if (!selectedNode) return true;

      const node = allNodes.find((n) => n.id === nodeId);
      if (!node) return true;

      const isParentOrChild =
        node.data.parentId === selectedId || selectedNode.data.parentId === nodeId;

      return isParentOrChild;
    },
    [hoveredNode, selectedSchool, allNodes]
  );

  const handleClick = useCallback(
    (school: any) => {
      handleNodeClick(school);
      if (onSchoolSelect && !selectedSchool) {
        onSchoolSelect(school.id);
      }
    },
    [handleNodeClick, onSchoolSelect, selectedSchool]
  );

  return (
    <div className="relative w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Layers className="w-4 h-4 text-ink/60" />
          <span className="text-sm font-medium text-ink/70">朝代筛选：</span>
          {DYNASTY_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedPeriod(option.id as DynastyPeriod)}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg transition-all duration-200',
                selectedPeriod === option.id
                  ? 'bg-ink text-paper shadow-md'
                  : 'bg-stone-100 text-ink/70 hover:bg-stone-200'
              )}
            >
              {option.name}
              {option.years && (
                <span className="ml-1 text-[10px] opacity-70">{option.years}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">共 {filteredSchools.length} 个流派</Badge>
          <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomOut}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-ink/60 w-12 text-center">{Math.round(zoom * 100)}%</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleZoomIn}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-stone-300 mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetView}
              className="h-8 w-8 p-0"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-paper via-stone-50/30 to-paper rounded-2xl border border-stone-200/60 overflow-hidden shadow-inner">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(30, 77, 107, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(245, 124, 0, 0.03) 0%, transparent 70%)
            `,
          }} />
        </div>

        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-8 z-10">
          {[
            { period: '先秦', y: 200 },
            { period: '两汉', y: 400 },
            { period: '魏晋', y: 500 },
            { period: '隋唐', y: 600 },
            { period: '宋明', y: 800 },
          ].map((era, idx) => (
            <div
              key={era.period}
              className="flex items-center gap-2"
              style={{
                transform: `translateY(${(era.y - 450) * zoom + pan.y}px)`,
              }}
            >
              <div className="w-12 h-px bg-gradient-to-r from-ochre/50 to-transparent" />
              <span className="text-xs text-ink/40 font-medium">{era.period}</span>
            </div>
          ))}
        </div>

        <div className="overflow-auto">
          <svg
            ref={svgRef}
            width={svgWidth}
            height={svgHeight}
            className="w-full max-w-full"
            style={{ minHeight: '600px' }}
          >
            <defs>
              <radialGradient id="glowGradient">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
              <filter id="inkBlur">
                <feGaussianBlur stdDeviation="2" />
              </filter>
              <pattern id="paperTexture" patternUnits="userSpaceOnUse" width="100" height="100">
                <rect width="100" height="100" fill="transparent" />
                <circle cx="25" cy="25" r="0.5" fill="rgba(139, 115, 85, 0.1)" />
                <circle cx="75" cy="75" r="0.5" fill="rgba(139, 115, 85, 0.08)" />
                <circle cx="50" cy="10" r="0.3" fill="rgba(139, 115, 85, 0.06)" />
              </pattern>
            </defs>

            <rect width="100%" height="100%" fill="url(#paperTexture)" />

            <g
              style={{
                transform: `translate(${pan.x + 100}px, ${pan.y + 50}px) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
            >
              {links.map((link, idx) => (
                <TreeLink
                  key={`link-${idx}`}
                  source={{ x: link.source.x, y: link.source.y }}
                  target={{ x: link.target.x, y: link.target.y }}
                  sourceData={link.source.data}
                  targetData={link.target.data}
                  isHighlighted={
                    isHighlighted(link.source.id) && isHighlighted(link.target.id)
                  }
                />
              ))}

              {allNodes.map((node, idx) => (
                <g
                  key={node.id}
                  style={{
                    opacity: isHighlighted(node.id) ? 1 : 0.2,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <TreeNode
                    school={node.data}
                    x={node.x}
                    y={node.y}
                    isSelected={selectedSchool?.id === node.id}
                    isHovered={hoveredNode === node.id}
                    onHover={handleNodeHover}
                    onClick={handleClick}
                    index={idx}
                  />
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {selectedSchool && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 p-4 bg-paper rounded-xl border border-stone-200 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: selectedSchool.color }}
                  >
                    {selectedSchool.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ink">{selectedSchool.name}</h3>
                    <p className="text-xs text-ink/50">{selectedSchool.period}时期</p>
                  </div>
                </div>
                <p className="text-sm text-ink/70 leading-relaxed">
                  {selectedSchool.description.substring(0, 100)}...
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {selectedSchool.coreIdeas.slice(0, 5).map((idea) => (
                    <Badge
                      key={idea}
                      variant="solid"
                      color={selectedSchool.color}
                      className="text-white"
                    >
                      {idea}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNodeClick(selectedSchool)}
              >
                关闭
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
