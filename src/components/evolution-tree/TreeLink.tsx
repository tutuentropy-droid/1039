import { motion } from 'framer-motion';
import { School } from '@/types';

interface TreeLinkProps {
  source: { x: number; y: number };
  target: { x: number; y: number };
  sourceData: School;
  targetData: School;
  isHighlighted?: boolean;
  animated?: boolean;
}

export const TreeLink = ({ source, target, sourceData, isHighlighted = false, animated = true }: TreeLinkProps) => {
  const midX = (source.x + target.x) / 2;
  const midY = (source.y + target.y) / 2 - 30;

  const pathD = `M ${source.x} ${source.y} Q ${midX} ${midY} ${target.x} ${target.y}`;

  return (
    <g>
      <motion.path
        d={pathD}
        fill="none"
        stroke={isHighlighted ? sourceData.color : '#D4C4B0'}
        strokeWidth={isHighlighted ? 3 : 2}
        strokeOpacity={isHighlighted ? 0.9 : 0.4}
        initial={animated ? { pathLength: 0, opacity: 0 } : false}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 1.5, ease: 'easeOut' },
          opacity: { duration: 0.5 },
        }}
        style={{
          filter: isHighlighted ? `drop-shadow(0 0 6px ${sourceData.color})` : 'none',
        }}
      />
      {isHighlighted && (
        <motion.circle
          r={6}
          fill={sourceData.color}
          initial={{ offsetDistance: '0%', opacity: 0 }}
          animate={{ offsetDistance: '100%', opacity: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
            opacity: { duration: 0.3 },
          }}
          style={{
            offsetPath: `path('${pathD}')`,
            filter: `drop-shadow(0 0 4px ${sourceData.color})`,
          }}
        />
      )}
    </g>
  );
};
