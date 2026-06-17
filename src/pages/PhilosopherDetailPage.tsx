import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Users, Link2, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { dataService } from '@/services/dataService';

const PhilosopherDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const philosopher = id ? dataService.getPhilosopherWithDetails(id) : undefined;

  if (!philosopher) {
    return <Navigate to="/" replace />;
  }

  const { philosopher: p, works, school } = philosopher;
  const description = p.description || p.biography;
  const place = p.place || p.biography.match(/([^，。]*人)/)?.[1] || '籍贯不详';

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="relative overflow-hidden rounded-2xl mb-8"
            style={{
              background: `linear-gradient(135deg, ${school?.color || '#8B7355'}20 0%, ${school?.color || '#8B7355'}08 100%)`,
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ backgroundColor: school?.color || '#8B7355' }} />
            <div className="relative p-8 sm:p-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shadow-xl"
                  style={{ backgroundColor: school?.color || '#8B7355' }}
                >
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-2">{p.name}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    {school && (
                      <Badge
                        variant="solid"
                        className="text-sm px-3 py-1"
                        style={{ backgroundColor: `${school.color}20`, color: school.color }}
                      >
                        {school.name}
                      </Badge>
                    )}
                    <Badge variant="outline">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {p.dynasty}
                    </Badge>
                    <Badge variant="outline">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      {place}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>人物简介</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-ink/70 leading-relaxed text-base">{description}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-ochre" />
                    核心思想
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {p.coreIdeas.map((idea, index) => (
                      <motion.div
                        key={idea}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-stone-50 to-white border border-stone-200"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mb-3"
                          style={{ backgroundColor: school?.color || '#8B7355' }}
                        >
                          {index + 1}
                        </div>
                        <p className="font-medium text-ink">{idea}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {works.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-indigo-cn" />
                      代表著作
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {works.map((work) => (
                        <div
                          key={work.id}
                          className="p-4 rounded-xl border border-stone-200 hover:border-indigo-cn/30 hover:bg-indigo-cn/5 transition-all duration-300"
                        >
                          <h4 className="font-bold text-ink mb-2">{work.title}</h4>
                          <p className="text-sm text-ink/60 leading-relaxed line-clamp-3">
                            {work.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-ochre" />
                    所属流派
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {school && (
                    <div
                      className="p-4 rounded-xl cursor-pointer hover:shadow-md transition-all duration-300"
                      style={{ backgroundColor: `${school.color}08` }}
                      onClick={() => navigate(`/school/${school.id}`)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                          style={{ backgroundColor: school.color }}
                        >
                          {school.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-ink">{school.name}</h4>
                          <p className="text-xs text-ink/50">{school.dynasty}</p>
                        </div>
                      </div>
                      <p className="text-sm text-ink/60 line-clamp-3">{school.description}</p>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        查看流派详情
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-indigo-cn" />
                    思想关系
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-ink/60 mb-4">
                    探索这位哲学家与其他思想家、流派之间的思想传承关系
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/relations')}
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    进入关系图
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhilosopherDetailPage;
