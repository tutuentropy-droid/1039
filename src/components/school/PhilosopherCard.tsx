import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { Philosopher } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { dataService } from '@/services/dataService';
import { cn } from '@/lib/utils';

interface PhilosopherCardProps {
  philosopher: Philosopher;
  index?: number;
}

export const PhilosopherCard = ({ philosopher, index = 0 }: PhilosopherCardProps) => {
  const navigate = useNavigate();
  const school = dataService.getSchoolById(philosopher.schoolId);
  const works = dataService.getWorksByAuthor(philosopher.id);

  const handleClick = () => {
    navigate(`/philosopher/${philosopher.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        hover
        onClick={handleClick}
        borderColor={school?.color + '30'}
        className="group h-full"
      >
        <CardContent className="p-5">
          <div className="flex gap-4">
            <div className="relative flex-shrink-0">
              <div
                className="w-16 h-16 rounded-full overflow-hidden border-[3px] shadow-lg"
                style={{ borderColor: school?.color || '#8B7355' }}
              >
                <img
                  src={philosopher.imageUrl}
                  alt={philosopher.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: school?.color || '#8B7355' }}
              >
                子
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-bold text-ink text-lg">{philosopher.name}</h4>
                {school && (
                  <Badge
                    variant="solid"
                    color={school.color}
                    className="text-white text-[10px]"
                  >
                    {school.name}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-ink/50 mb-2">
                <Calendar className="w-3 h-3" />
                <span>{philosopher.birthYear} - {philosopher.deathYear}</span>
                <span className="mx-1">·</span>
                <span>{philosopher.dynasty}</span>
              </div>

              <p className="text-xs text-ink/60 leading-relaxed line-clamp-2 mb-3">
                {philosopher.biography}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {philosopher.coreIdeas.slice(0, 3).map((idea) => (
                  <span
                    key={idea}
                    className="px-1.5 py-0.5 bg-stone-100 text-[10px] text-ink/70 rounded"
                  >
                    {idea}
                  </span>
                ))}
              </div>

              {works.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-ink/50">
                  <BookOpen className="w-3 h-3" />
                  <span>著有 {works[0].title}{works.length > 1 ? ` 等${works.length}部` : ''}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-ink/40">查看人物详情</span>
            <ArrowRight
              className="w-4 h-4 text-ink/30 group-hover:text-ink/60 group-hover:translate-x-1 transition-all"
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
