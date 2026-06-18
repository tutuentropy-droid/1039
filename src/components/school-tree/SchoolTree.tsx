import { useEffect, useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  GitBranch,
  Filter,
  Info,
  X,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSchoolTree, TreeGraphNode } from '@/hooks/useSchoolTree';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  RELATION_TYPE_LABELS,
  RELATION_TYPE_COLORS,
  School,
  Philosopher,
  RelationType,
} from '@/types';
import { dataService } from '@/services/dataService';
import { cn } from '@/lib/utils';

const ALL_RELATION_TYPES: RelationType[] = [
  'teacher-student',
  'inheritance',
  'borrow',
  'influence',
  'criticize',
  'opposition',
];

const RELATION_TYPE_DESCRIPTIONS: Record<RelationType, string> = {
  'teacher-student': '师徒之间的学术传承关系，如孔子与孟子',
  'inheritance': '思想学说的直接继承与发展关系',
  'borrow': '吸收借鉴其他流派或思想家的观点方法',
  'influence': '思想学说之间的相互影响与启发',
  'criticize': '对某一思想观点的批判与反驳',
  'opposition': '思想观点上的根本对立与争鸣',
};

interface SchoolTreeProps {
  initialSchoolId?: string;
}

export const SchoolTree = ({ initialSchoolId }: SchoolTreeProps) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string | null>(initialSchoolId || null);
  const [enabledRelationTypes, setEnabledRelationTypes] = useState<RelationType[]>(ALL_RELATION_TYPES);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showRelationFilter, setShowRelationFilter] = useState(false);

  const {
    svgRef,
    dimensions,
    setDimensions,
    zoom,
    graphData,
    selectedNodeData,
    hoveredNodeData,
    handleBackgroundClick,
    handleZoomIn,
    handleZoomOut,
    handleResetView,
  } = useSchoolTree({
    selectedSchoolId: selectedSchoolFilter,
    enabledRelationTypes,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(width - 48, 800),
          height: 750,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [setDimensions]);

  const allSchools = useMemo(() => dataService.getAllSchools(), []);

  const getEntityDescription = (data: School | Philosopher) => {
    return 'biography' in data ? data.description || data.biography : data.description;
  };

  const handleNodeNavigate = () => {
    if (!selectedNodeData) return;
    if (selectedNodeData.type === 'school') {
      navigate(`/school/${selectedNodeData.id}`);
    } else {
      navigate(`/philosopher/${selectedNodeData.id}`);
    }
  };

  const toggleRelationType = (type: RelationType) => {
    setEnabledRelationTypes(prev => {
      if (prev.includes(type)) {
        const filtered = prev.filter(t => t !== type);
        return filtered.length === 0 ? prev : filtered;
      }
      return [...prev, type];
    });
  };

  const getDisplayNode = (): TreeGraphNode | null => {
    return selectedNodeData || hoveredNodeData;
  };

  const displayNode = getDisplayNode();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          <h1 className="text-3xl font-bold text-ink mb-2">哲学门派传承树</h1>
          <p className="text-ink/60">
            探索哲学家之间的师承关系、思想借鉴与批判论争，拖动节点查看不同颜色的连接线
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-ochre" />
                    门派传承图谱
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowFilterDropdown(!showFilterDropdown);
                          setShowRelationFilter(false);
                        }}
                      >
                        <Filter className="w-4 h-4 mr-1" />
                        {selectedSchoolFilter
                          ? allSchools.find(s => s.id === selectedSchoolFilter)?.name
                          : '全部流派'}
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </Button>
                      {showFilterDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full right-0 mt-2 w-48 bg-paper border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden"
                        >
                          <button
                            onClick={() => {
                              setSelectedSchoolFilter(null);
                              setShowFilterDropdown(false);
                            }}
                            className={cn(
                              'w-full px-3 py-2 text-left text-sm hover:bg-stone-100 transition-colors',
                              !selectedSchoolFilter && 'bg-ochre/10 text-ochre font-medium'
                            )}
                          >
                            全部流派
                          </button>
                          {allSchools.map(school => (
                            <button
                              key={school.id}
                              onClick={() => {
                                setSelectedSchoolFilter(school.id);
                                setShowFilterDropdown(false);
                              }}
                              className={cn(
                                'w-full px-3 py-2 text-left text-sm hover:bg-stone-100 transition-colors flex items-center gap-2',
                                selectedSchoolFilter === school.id && 'bg-ochre/10 text-ochre font-medium'
                              )}
                            >
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: school.color }}
                              />
                              {school.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>

                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowRelationFilter(!showRelationFilter);
                          setShowFilterDropdown(false);
                        }}
                      >
                        <Filter className="w-4 h-4 mr-1" />
                        关系类型
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </Button>
                      {showRelationFilter && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute top-full right-0 mt-2 w-56 bg-paper border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden"
                        >
                          {ALL_RELATION_TYPES.map(type => (
                            <button
                              key={type}
                              onClick={() => toggleRelationType(type)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-stone-100 transition-colors flex items-center gap-2"
                            >
                              <div
                                className={cn(
                                  'w-4 h-4 rounded border-2 flex items-center justify-center',
                                  enabledRelationTypes.includes(type)
                                    ? 'border-ochre bg-ochre'
                                    : 'border-stone-300'
                                )}
                              >
                                {enabledRelationTypes.includes(type) && (
                                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-white">
                                    <path
                                      fill="currentColor"
                                      d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div
                                className="w-6 h-1 rounded"
                                style={{ backgroundColor: RELATION_TYPE_COLORS[type] }}
                              />
                              <span className="text-ink">{RELATION_TYPE_LABELS[type]}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomOut}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-xs text-ink/60 w-12 text-center">
                        {Math.round(zoom * 100)}%
                      </span>
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
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  ref={containerRef}
                  className="relative bg-gradient-to-br from-paper via-stone-50/30 to-paper"
                  onClick={() => {
                    handleBackgroundClick();
                    setShowFilterDropdown(false);
                    setShowRelationFilter(false);
                  }}
                >
                  <svg
                    ref={svgRef}
                    width={dimensions.width}
                    height={dimensions.height}
                    className="w-full"
                  />

                  <div className="absolute top-4 left-4 bg-paper/90 backdrop-blur-sm rounded-lg p-3 border border-stone-200 max-w-[200px]">
                    <p className="text-xs font-medium text-ink/80 mb-2">关系图例</p>
                    <div className="space-y-1.5">
                      {ALL_RELATION_TYPES.map(type => {
                        const isCriticize = type === 'criticize' || type === 'opposition';
                        const isBorrow = type === 'borrow';
                        return (
                          <div key={type} className="flex items-center gap-2">
                            <div className="w-8 relative">
                              <div
                                className="h-0.5 rounded"
                                style={{ backgroundColor: RELATION_TYPE_COLORS[type] }}
                              />
                              {isCriticize && (
                                <div
                                  className="absolute top-0 left-0 right-0 h-0.5 rounded"
                                  style={{
                                    backgroundColor: RELATION_TYPE_COLORS[type],
                                    backgroundImage:
                                      'repeating-linear-gradient(90deg, transparent, transparent 4px, #faf5ec 4px, #faf5ec 8px)',
                                  }}
                                />
                              )}
                              {isBorrow && (
                                <div
                                  className="absolute top-0 left-0 right-0 h-0.5 rounded"
                                  style={{
                                    backgroundColor: RELATION_TYPE_COLORS[type],
                                    backgroundImage:
                                      'repeating-linear-gradient(90deg, transparent, transparent 2px, #faf5ec 2px, #faf5ec 5px)',
                                  }}
                                />
                              )}
                            </div>
                            <span className="text-xs text-ink/60">
                              {RELATION_TYPE_LABELS[type]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-ink/40 mt-2">
                      实线：传承/师承 虚线：借鉴 点线：批判
                    </p>
                  </div>

                  <AnimatePresence>
                    {displayNode && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute top-4 right-4 bg-paper/95 backdrop-blur-sm rounded-xl p-4 border border-stone-200 shadow-xl w-64 z-10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-md"
                              style={{ backgroundColor: displayNode.color }}
                            >
                              {displayNode.type === 'school' ? '派' : displayNode.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-ink">{displayNode.name}</h3>
                              <Badge variant="outline" className="mt-0.5 text-[10px]">
                                {displayNode.type === 'school' ? '思想流派' : (displayNode.data as Philosopher).dynasty}
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBackgroundClick();
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>

                        <p className="text-xs text-ink/70 leading-relaxed mb-3 line-clamp-3">
                          {getEntityDescription(displayNode.data).substring(0, 120)}...
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {('coreIdeas' in displayNode.data ? displayNode.data.coreIdeas : []).slice(0, 4).map((idea: string) => (
                            <Badge key={idea} variant="outline" className="text-[10px]">
                              {idea}
                            </Badge>
                          ))}
                        </div>

                        <Button size="sm" className="w-full" onClick={handleNodeNavigate}>
                          查看完整详情
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-ochre" />
                    使用说明
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-ink/60 flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="text-sm text-ink/70">
                      <span className="font-medium text-ink">拖动节点</span>可重新排列图谱布局
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-ink/60 flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-sm text-ink/70">
                      <span className="font-medium text-ink">鼠标滚轮</span>可缩放图谱
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-ink/60 flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="text-sm text-ink/70">
                      <span className="font-medium text-ink">点击节点</span>查看哲学家或流派详情
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-ink/60 flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <p className="text-sm text-ink/70">
                      使用<span className="font-medium text-ink">筛选器</span>按流派或关系类型过滤
                    </p>
                  </div>
                </CardContent>
              </Card>
            </AnimatePresence>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-ochre" />
                  关系类型详解
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ALL_RELATION_TYPES.map(type => (
                  <div key={type} className="flex items-start gap-3">
                    <div
                      className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: RELATION_TYPE_COLORS[type] }}
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {RELATION_TYPE_LABELS[type]}
                      </p>
                      <p className="text-xs text-ink/50 leading-relaxed">
                        {RELATION_TYPE_DESCRIPTIONS[type]}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-ochre" />
                  图谱统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-ochre/5 rounded-lg text-center">
                    <p className="text-2xl font-bold text-ochre">{graphData.nodes.filter(n => n.type === 'philosopher').length}</p>
                    <p className="text-xs text-ink/50 mt-0.5">哲学家</p>
                  </div>
                  <div className="p-3 bg-indigo-cn/5 rounded-lg text-center">
                    <p className="text-2xl font-bold text-indigo-cn">{graphData.nodes.filter(n => n.type === 'school').length}</p>
                    <p className="text-xs text-ink/50 mt-0.5">思想流派</p>
                  </div>
                  <div className="p-3 bg-jade/5 rounded-lg text-center col-span-2">
                    <p className="text-2xl font-bold text-jade">{graphData.links.length}</p>
                    <p className="text-xs text-ink/50 mt-0.5">思想关系连线</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
