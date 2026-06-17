import { motion } from 'framer-motion';
import { BookOpen, GitBranch, Link2, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EvolutionTree } from '@/components/evolution-tree/EvolutionTree';
import { SchoolCard } from '@/components/school/SchoolCard';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { dataService } from '@/services/dataService';

const Home = () => {
  const navigate = useNavigate();
  const mainSchools = dataService.getMainSchools();

  const features = [
    {
      icon: GitBranch,
      title: '思想演化树',
      description: '直观展现从先秦诸子到宋明理学的思想传承脉络，每一个节点都承载着千年智慧。',
    },
    {
      icon: Link2,
      title: '关系探索',
      description: '深入探索各流派、思想家之间的传承、影响、对立关系，发现思想碰撞的火花。',
    },
    {
      icon: BookOpen,
      title: '典籍研读',
      description: '研读《论语》《道德经》《庄子》等经典著作，直抵先贤智慧的本源。',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-ochre/5 via-transparent to-indigo/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-ochre/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 border-ochre/30 bg-ochre/5 text-ochre">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              开启中国哲学智慧之旅
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-6 leading-tight">
              中国哲学
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ochre via-cinnabar to-indigo">
                {' '}思想长河{' '}
              </span>
              探索
            </h1>

            <p className="text-lg sm:text-xl text-ink/60 mb-10 leading-relaxed max-w-3xl mx-auto">
              从先秦诸子百家争鸣，到宋明理学的融会贯通，穿越千年时光，
              探索儒家、道家、墨家、法家等思想流派的演化脉络，
              与孔子、老子、庄子、墨子等先贤对话。
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate('/relations')}>
                <Link2 className="w-5 h-5 mr-2" />
                探索思想关系
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button size="lg" variant="outline">
                <BookOpen className="w-5 h-5 mr-2" />
                了解更多
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-ink mb-3">核心思想流派</h2>
            <p className="text-ink/60 max-w-2xl mx-auto">
              先秦诸子百家争鸣，奠定了中国哲学的根基。以下是对后世影响最为深远的六大思想流派
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {mainSchools.map((school) => (
              <motion.div key={school.id} variants={itemVariants}>
                <SchoolCard school={school} onClick={() => navigate(`/school/${school.id}`)} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-ink mb-3">思想演化全景</h2>
            <p className="text-ink/60 max-w-2xl mx-auto">
              从先秦到宋明，两千余年的思想发展脉络尽收眼底。点击任意节点，深入了解该流派的智慧精髓
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <EvolutionTree />
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-ink mb-3">平台特色</h2>
            <p className="text-ink/60 max-w-2xl mx-auto">
              融合传统美学与现代科技，打造沉浸式的中国哲学学习体验
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colors = ['from-ochre/20 to-ochre/5', 'from-indigo/20 to-indigo/5', 'from-cinnabar/20 to-cinnabar/5'];
              const iconColors = ['text-ochre', 'text-indigo', 'text-cinnabar'];

              return (
                <motion.div key={feature.title} variants={itemVariants}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-8">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors[index]} flex items-center justify-center mb-6`}
                      >
                        <Icon className={`w-7 h-7 ${iconColors[index]}`} />
                      </div>
                      <h3 className="text-xl font-bold text-ink mb-3">{feature.title}</h3>
                      <p className="text-ink/60 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-ochre/10 via-paper to-indigo/10 rounded-2xl p-8 sm:p-12 border border-ochre/10 text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-ochre/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-4">
                准备好探索中国哲学的智慧宝库了吗？
              </h2>
              <p className="text-ink/60 mb-8 max-w-xl mx-auto">
                无论是寻找安身立命的人生智慧，还是探索治国理政的思想资源，
                这里都能为您打开一扇通向古代先贤的大门。
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" onClick={() => navigate('/relations')}>
                  开始探索之旅
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/school/rujia')}>
                  从儒家开始
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
