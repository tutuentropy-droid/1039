import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Users, BookOpen, Lightbulb, Star } from 'lucide-react';
import { MapNode, MapLocation, MAP_NODE_TYPE_LABELS, MAP_NODE_TYPE_COLORS } from '@/types';
import { getPhilosopherById } from '@/data/philosophers';
import { getSchoolById } from '@/data/schools';
import { getNodesByLocation } from '@/data/mapData';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

interface NodeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: MapNode | null;
  location: MapLocation | null;
}

export const NodeDetailModal = ({ isOpen, onClose, node, location }: NodeDetailModalProps) => {
  if (!node || !location) return null;

  const philosopher = node.philosopherId ? getPhilosopherById(node.philosopherId) : null;
  const school = node.schoolId ? getSchoolById(node.schoolId) : null;

  const locationNodes = getNodesByLocation(location.id);
  const otherNodes = locationNodes.filter((n) => n.id !== node.id);

  const nodeColor = MAP_NODE_TYPE_COLORS[node.type];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-2xl mx-auto z-50 max-h-[90vh] overflow-y-auto"
          >
            <Card className="bg-paper border-stone-200 shadow-2xl overflow-hidden">
              <div
                className="h-2"
                style={{
                  background: `linear-gradient(90deg, ${nodeColor} 0%, ${nodeColor}80 100%)`,
                }}
              />

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
                      style={{ backgroundColor: nodeColor }}
                    >
                      {node.type === 'birthplace' && <Users className="w-7 h-7" />}
                      {node.type === 'lecture' && <BookOpen className="w-7 h-7" />}
                      {node.type === 'event' && <Star className="w-7 h-7" />}
                      {node.type === 'school' && <Lightbulb className="w-7 h-7" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: nodeColor + '15', color: nodeColor }}
                        >
                          {MAP_NODE_TYPE_LABELS[node.type]}
                        </span>
                        <span className="text-xs text-ink/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {node.yearLabel}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-ink mb-1">{node.title}</h2>
                      <div className="flex items-center gap-1 text-sm text-ink/50">
                        <MapPin className="w-4 h-4" />
                        {location.name}（{location.modernName}）
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-stone-100 text-ink/40 hover:text-ink/70 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-ink/60 mb-2 flex items-center gap-2">
                      <span className="w-1 h-4 rounded-full" style={{ backgroundColor: nodeColor }} />
                      事件简介
                    </h3>
                    <p className="text-ink/80 leading-relaxed">{node.description}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-ink/60 mb-2 flex items-center gap-2">
                      <span className="w-1 h-4 rounded-full" style={{ backgroundColor: nodeColor }} />
                      相关思想
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {node.relatedIdeas.map((idea) => (
                        <Badge
                          key={idea}
                          variant="outline"
                          style={{ borderColor: nodeColor + '40', color: nodeColor }}
                        >
                          {idea}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {philosopher && (
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                      <h3 className="text-sm font-semibold text-ink/60 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        相关人物
                      </h3>
                      <div className="flex items-center gap-3">
                        <img
                          src={philosopher.imageUrl}
                          alt={philosopher.name}
                          className="w-14 h-14 rounded-xl object-cover shadow-md"
                        />
                        <div className="flex-1">
                          <div className="font-bold text-ink">{philosopher.name}</div>
                          <div className="text-xs text-ink/50 mb-1">
                            {philosopher.dynasty} · {philosopher.birthYear} - {philosopher.deathYear}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {philosopher.coreIdeas.slice(0, 3).map((idea) => (
                              <span
                                key={idea}
                                className="px-1.5 py-0.5 bg-white text-xs text-ink/60 rounded border border-stone-200"
                              >
                                {idea}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {school && (
                    <div
                      className="p-4 rounded-xl border"
                      style={{ backgroundColor: school.color + '08', borderColor: school.color + '20' }}
                    >
                      <h3
                        className="text-sm font-semibold mb-3 flex items-center gap-2"
                        style={{ color: school.color }}
                      >
                        <Lightbulb className="w-4 h-4" />
                        相关学派
                      </h3>
                      <div className="font-bold text-ink mb-1">{school.name}</div>
                      <p className="text-sm text-ink/60 leading-relaxed">{school.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-semibold text-ink/60 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      地点文化
                    </h3>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-ochre/5 to-transparent border border-ochre/10">
                      <div className="font-medium text-ink mb-2">{location.name}</div>
                      <p className="text-sm text-ink/70 leading-relaxed mb-3">
                        {location.culturalSignificance}
                      </p>
                      <div className="text-xs text-ink/40">
                        今属：{location.province} · {location.modernName}
                      </div>
                    </div>
                  </div>

                  {otherNodes.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-ink/60 mb-3 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        该地其他事件
                      </h3>
                      <div className="space-y-2">
                        {otherNodes.map((otherNode) => (
                          <div
                            key={otherNode.id}
                            className="p-3 rounded-lg bg-white border border-stone-100 flex items-center gap-3 hover:border-stone-200 transition-colors"
                          >
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{
                                backgroundColor: MAP_NODE_TYPE_COLORS[otherNode.type],
                              }}
                            >
                              {MAP_NODE_TYPE_LABELS[otherNode.type].charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-ink truncate">
                                {otherNode.title}
                              </div>
                              <div className="text-xs text-ink/40">{otherNode.yearLabel}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NodeDetailModal;
