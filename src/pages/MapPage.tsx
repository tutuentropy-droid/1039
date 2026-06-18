import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, BookOpen, Sparkles } from 'lucide-react';
import { MapNode, MapLocation, DynastyPeriod, DYNASTY_OPTIONS } from '@/types';
import { mapNodes, getNodesByPeriod } from '@/data/mapData';
import { ChinaMap } from '@/components/map/ChinaMap';
import { MapTimeline } from '@/components/map/MapTimeline';
import { NodeDetailModal } from '@/components/map/NodeDetailModal';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const MapPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<DynastyPeriod>('all');
  const [currentYear, setCurrentYear] = useState(-600);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const currentPeriod = DYNASTY_OPTIONS.find((d) => d.id === selectedPeriod);
  const minYear = currentPeriod ? currentPeriod.startYear : -600;
  const maxYear = currentPeriod ? currentPeriod.endYear : 1600;

  const visibleNodes = useMemo(() => {
    if (selectedPeriod === 'all') {
      return mapNodes;
    }
    return getNodesByPeriod(minYear, maxYear);
  }, [selectedPeriod, minYear, maxYear]);

  const activeNodesCount = useMemo(() => {
    return visibleNodes.filter((n) => n.year <= currentYear).length;
  }, [visibleNodes, currentYear]);

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const yearsPerSecond = 50 * playSpeed;
      const yearIncrement = (deltaTime / 1000) * yearsPerSecond;

      setCurrentYear((prev) => {
        const next = prev + yearIncrement;
        if (next >= maxYear) {
          setIsPlaying(false);
          return maxYear;
        }
        return next;
      });

      animationRef.current = requestAnimationFrame(animate);
    },
    [playSpeed, maxYear]
  );

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  useEffect(() => {
    if (currentYear < minYear) {
      setCurrentYear(minYear);
    }
    if (currentYear > maxYear) {
      setCurrentYear(maxYear);
    }
  }, [selectedPeriod, minYear, maxYear, currentYear]);

  const handlePlayToggle = useCallback(() => {
    if (currentYear >= maxYear) {
      setCurrentYear(minYear);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentYear, minYear, maxYear]);

  const handleYearChange = useCallback((year: number) => {
    setCurrentYear(year);
    if (isPlaying) {
      setIsPlaying(false);
    }
  }, [isPlaying]);

  const handlePeriodChange = useCallback((period: DynastyPeriod) => {
    setSelectedPeriod(period);
    setIsPlaying(false);
  }, []);

  const handleNodeClick = useCallback((node: MapNode, location: MapLocation) => {
    setSelectedNode(node);
    setSelectedLocation(location);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const currentYearInt = Math.round(currentYear);

  const nodesThisYear = useMemo(() => {
    return visibleNodes.filter((n) => n.year === currentYearInt);
  }, [visibleNodes, currentYearInt]);

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-paper to-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <Badge className="mb-4 border-ochre/30 bg-ochre/5 text-ochre">
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            地理与思想
          </Badge>
          <h1 className="text-4xl font-bold text-ink mb-3">
            中国哲学<span className="text-transparent bg-clip-text bg-gradient-to-r from-ochre to-indigo-cn">地图</span>
          </h1>
          <p className="text-ink/60 max-w-2xl mx-auto">
            将哲学家的出生地、讲学之地和重要历史事件标注在中国地图上，
            拖动时间轴或点击播放，动态感受中国哲学思想的历史演进与地理分布
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <ChinaMap
                  nodes={visibleNodes}
                  currentYear={currentYearInt}
                  isPlaying={isPlaying}
                  onNodeClick={handleNodeClick}
                  selectedNodeId={selectedNode?.id}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <MapTimeline
              currentYear={currentYearInt}
              minYear={minYear}
              maxYear={maxYear}
              isPlaying={isPlaying}
              playSpeed={playSpeed}
              selectedPeriod={selectedPeriod}
              onYearChange={handleYearChange}
              onPlayToggle={handlePlayToggle}
              onSpeedChange={setPlaySpeed}
              onPeriodChange={handlePeriodChange}
            />

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-ochre" />
                  当前进度
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-ink/60">已出现节点</span>
                    <span className="text-sm font-bold text-ink">
                      {activeNodesCount} / {visibleNodes.length}
                    </span>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-ochre to-indigo-cn transition-all duration-300"
                      style={{
                        width: `${visibleNodes.length > 0 ? (activeNodesCount / visibleNodes.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {nodesThisYear.length > 0 && (
              <motion.div
                key={currentYearInt}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-ochre/30 bg-ochre/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="w-4 h-4 text-ochre" />
                      本年事件
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    {nodesThisYear.map((node) => (
                      <div
                        key={node.id}
                        className="p-3 bg-white rounded-lg border border-stone-100 cursor-pointer hover:border-ochre/30 hover:shadow-sm transition-all"
                        onClick={() => {
                          const location = mapNodes.find((n) => n.id === node.id)?.locationId;
                          if (location) {
                            const locData = mapNodes.find((n) => n.locationId === location);
                          }
                        }}
                      >
                        <div className="font-medium text-ink text-sm">{node.title}</div>
                        <div className="text-xs text-ink/50 mt-1">{node.description.slice(0, 40)}...</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10"
        >
          <Card className="bg-gradient-to-br from-ochre/5 via-paper to-indigo-cn/5 border-ochre/10">
            <CardContent className="p-8 text-center">
              <BookOpen className="w-8 h-8 text-ochre mx-auto mb-3" />
              <h3 className="text-xl font-bold text-ink mb-2">思想的足迹</h3>
              <p className="text-sm text-ink/60 max-w-2xl mx-auto">
                中国哲学的发展与地理环境密不可分。从齐鲁大地的儒家思想，到楚文化孕育的道家精神，
                从稷下学宫的百家争鸣，到宋明理学的南北辉映。每一位哲人、每一个学派，
                都在中华大地上留下了深深的思想足迹。
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <NodeDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        node={selectedNode}
        location={selectedLocation}
      />
    </div>
  );
};

export default MapPage;
