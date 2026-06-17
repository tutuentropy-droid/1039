import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Link2, X, ArrowRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRelationGraph } from '@/hooks/useRelationGraph';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RELATION_TYPE_LABELS, RELATION_TYPE_COLORS, School, Philosopher } from '@/types';
import { dataService } from '@/services/dataService';
import { cn } from '@/lib/utils';

export const RelationGraph = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    svgRef,
    dimensions,
    setDimensions,
    selectedNodeData,
    pathStartId,
    pathEndId,
    currentPath,
    calculatePath,
    clearPath,
    handleBackgroundClick,
  } = useRelationGraph();

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.clientWidth;
        setDimensions({
          width: Math.max(width - 48, 600),
          height: 650,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [setDimensions]);

  const getEntityName = (id: string): string => {
    const school = dataService.getSchoolById(id);
    if (school) return school.name;
    const philosopher = dataService.getPhilosopherById(id);
    if (philosopher) return philosopher.name;
    return id;
  };

  const handleNodeNavigate = useCallback(() => {
    if (!selectedNodeData) return;
    if (selectedNodeData.type === 'school') {
      navigate(`/school/${selectedNodeData.id}`);
    } else {
      navigate(`/philosopher/${selectedNodeData.id}`);
    }
  }, [selectedNodeData, navigate]);

  const getRelationLegend = () => {
    return Object.entries(RELATION_TYPE_LABELS).map(([type, label]) => (
      <div key={type} className="flex items-center gap-2">
      <div
        className="w-8 h-1 rounded"
        style={{ backgroundColor: RELATION_TYPE_COLORS[type as keyof typeof RELATION_TYPE_COLORS] }}
      />
      <span className="text-xs text-ink/60">{label}</span>
    </div>
  ));
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
          <h1 className="text-3xl font-bold text-ink mb-2">思想关系探索</h1>
          <p className="text-ink/60">
            点击节点选择起点和终点，探索中国哲学思想之间的传承、影响与对立关系
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-ochre" />
                  思想关系图
                </div>
                <div className="flex items-center gap-2">
                  {pathStartId && pathEndId && (
                    <Button size="sm" onClick={calculatePath}>
                      分析关联路径
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={clearPath}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div
                ref={containerRef}
                className="relative bg-gradient-to-br from-paper via-stone-50/30 to-paper"
                onClick={handleBackgroundClick}
              >
                <svg
                  ref={svgRef}
                  width={dimensions.width}
                  height={dimensions.height}
                  className="w-full"
                />

                <div className="absolute top-4 left-4 bg-paper/90 backdrop-blur-sm rounded-lg p-3 border border-stone-200">
                  <p className="text-xs font-medium text-ink/80 mb-2">关系图例</p>
                  <div className="space-y-1">
                    {getRelationLegend()}
                  </div>
                </div>

                <AnimatePresence>
                  {(pathStartId || pathEndId) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-4 right-4 bg-paper/95 backdrop-blur-sm rounded-xl p-4 border border-stone-200 shadow-xl min-w-[200px]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-ink">路径选择</span>
                        <Button variant="ghost" size="sm" onClick={clearPath} className="h-6 w-6 p-0">
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500" />
                          <span className="text-sm text-ink/70">
                            起点：
                            <span className="font-medium text-ink ml-1">
                              {pathStartId ? getEntityName(pathStartId) : '未选择'}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500" />
                          <span className="text-sm text-ink/70">
                            终点：
                            <span className="font-medium text-ink ml-1">
                              {pathEndId ? getEntityName(pathEndId) : '未选择'}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      {pathStartId && pathEndId && !currentPath && (
                        <Button
                          size="sm"
                          className="w-full mt-3"
                          onClick={calculatePath}
                        >
                          分析关联路径
                        </Button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {currentPath && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute bottom-4 left-4 right-4 bg-paper/95 backdrop-blur-sm rounded-xl p-4 border border-stone-200 shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-ink">关联路径分析</h4>
                      <Badge variant="outline">
                        共 {currentPath.length} 层关系
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {currentPath.map((rel, idx) => (
                        <div key={rel.id} className="flex items-center gap-2">
                          <div className="px-2 py-1 bg-stone-100 rounded text-sm text-ink">
                            {getEntityName(rel.sourceId)}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-ink/50">
                            <div
                              className="w-4 h-0.5 rounded"
                              style={{ backgroundColor: RELATION_TYPE_COLORS[rel.relationType] }}
                            />
                            <span>{RELATION_TYPE_LABELS[rel.relationType]}</span>
                            <div
                              className="w-4 h-0.5 rounded"
                              style={{ backgroundColor: RELATION_TYPE_COLORS[rel.relationType] }}
                            />
                          </div>
                          <div className="px-2 py-1 bg-stone-100 rounded text-sm text-ink">
                            {getEntityName(rel.targetId)}
                          </div>
                          {idx < currentPath.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-ink/30 mx-1" />
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {selectedNodeData ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-ochre" />
                        节点详情
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                          style={{ backgroundColor: selectedNodeData.color }}
                        >
                          {selectedNodeData.type === 'school' ? '學' : '子'}
                        </div>
                        <div>
                          <h3 className="font-bold text-ink text-lg">{selectedNodeData.name}</h3>
                          <Badge variant="outline" className="mt-1">
                            {selectedNodeData.type === 'school' ? '流派' : '人物'}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-ink/70 leading-relaxed mb-4">
                        {(selectedNodeData.data as School | Philosopher).description?.substring(0, 120)}...
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {(selectedNodeData.data as School | Philosopher).coreIdeas?.slice(0, 4).map((idea: string) => (
                          <Badge key={idea} variant="outline" className="text-xs">
                            {idea}
                          </Badge>
                        ))}
                      </div>

                      <Button className="w-full" onClick={handleNodeNavigate}>
                        查看完整详情
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                key="hint"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
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
                          点击任意<span className="font-medium text-ink">流派节点</span>（大圆形）或
                          <span className="font-medium text-ink">人物节点</span>（小圆形）查看详情
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600 flex-shrink-0 mt-0.5">
                        2
                        </div>
                        <p className="text-sm text-ink/70">
                          点击第一个节点作为<span className="font-medium text-emerald-600">路径起点</span>
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-600 flex-shrink-0 mt-0.5">
                        3
                        </div>
                        <p className="text-sm text-ink/70">
                          点击第二个节点作为<span className="font-medium text-amber-600">路径终点</span>
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-ochre/20 flex items-center justify-center text-xs font-bold text-ochre flex-shrink-0 mt-0.5">
                        4
                        </div>
                        <p className="text-sm text-ink/70">
                          点击<span className="font-medium text-ochre">分析关联路径</span>查看两节点之间的思想传承路径
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-ochre" />
                  关系类型说明
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(RELATION_TYPE_LABELS).map(([type, label]) => (
                  <div key={type} className="flex items-start gap-3">
                    <div
                      className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                      style={{ backgroundColor: RELATION_TYPE_COLORS[type as keyof typeof RELATION_TYPE_COLORS] }}
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">{label}</p>
                      <p className="text-xs text-ink/50">
                        {type === 'inheritance' && '思想学说的直接继承与发展关系'}
                        {type === 'influence' && '思想学说之间的相互影响与借鉴'}
                        {type === 'opposition' && '思想观点上的对立与争鸣'}
                        {type === 'teacher-student' && '师徒之间的学术传承'}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};
