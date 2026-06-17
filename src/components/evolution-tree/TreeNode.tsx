import { useState } from 'react';
import { motion } from 'framer-motion';
import { School } from '@/types';
import { cn } from '@/lib/utils';

interface TreeNodeProps {
  school: School;
  x: number;
  y: number;
  isSelected?: boolean;
  isHovered?: boolean;
  onHover: (id: string | null) => void;
  onClick: (school: School) => void;
  index: number;
}

export const TreeNode = ({
  school,
  x,
  y,
  isSelected = false,
  isHovered = false,
  onHover,
  onClick,
  index,
}: TreeNodeProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const nodeRadius = school.parentId ? 28 : 36;

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onMouseEnter={() => {
        onHover(school.id);
        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        onHover(null);
        setShowTooltip(false);
      }}
      onClick={() => onClick(school)}
      style={{ cursor: 'pointer' }}
    >
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          type: 'spring',
          stiffness: 200,
        }}
      >
        {isHovered && (
          <motion.circle
            r={nodeRadius + 15}
            fill="url(#glowGradient)"
            opacity={0.3}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.4 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        )}

        <circle
          r={nodeRadius + 6}
          fill={school.color}
          opacity={isSelected || isHovered ? 0.2 : 0.1}
          className="transition-all duration-300"
        />

        <circle
          r={nodeRadius}
          fill={school.color}
          stroke={isSelected || isHovered ? '#2C2416' : '#fff'}
          strokeWidth={isSelected || isHovered ? 3 : 2}
          className={cn(
            'transition-all duration-300',
            isSelected && 'drop-shadow-lg'
          )}
          style={{
            filter: isSelected
              ? `drop-shadow(0 0 12px ${school.color})`
              : isHovered
              ? `drop-shadow(0 0 8px ${school.color})`
              : 'none',
          }}
        />

        <circle
          r={nodeRadius - 10}
          fill="rgba(255,255,255,0.2)"
          cy={-4}
        />

        <text
          y={4}
          textAnchor="middle"
          fill="#fff"
          fontSize={school.parentId ? '14px' : '18px'}
          fontWeight="bold"
          className="select-none"
        >
          {school.name.charAt(0)}
        </text>

        <text
          y={nodeRadius + 22}
          textAnchor="middle"
          fill="#2C2416"
          fontSize="13px"
          fontWeight="600"
          className="select-none"
        >
          {school.name}
        </text>

        <text
          y={nodeRadius + 38}
          textAnchor="middle"
          fill="#8B7355"
          fontSize="11px"
          className="select-none"
        >
          {school.period}
        </text>
      </motion.g>

      {showTooltip && (
        <g>
          <foreignObject
            x={-120}
            y={-nodeRadius - 120}
            width={240}
            height={100}
            className="pointer-events-none"
          >
            <div className="bg-paper/95 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-stone-200">
              <h4 className="font-bold text-ink text-sm mb-1">{school.name}</h4>
              <p className="text-xs text-ink/70 line-clamp-3 leading-relaxed">
                {school.description.substring(0, 60)}...
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {school.coreIdeas.slice(0, 3).map((idea) => (
                  <span
                    key={idea}
                    className="px-1.5 py-0.5 bg-stone-100 text-[10px] text-ink/70 rounded"
                  >
                    {idea}
                  </span>
                ))}
              </div>
            </div>
          </foreignObject>
          <polygon
            points={`0,${-nodeRadius - 20} -8,${-nodeRadius - 8} 8,${-nodeRadius - 8}`}
            fill="#F5F0E6"
            stroke="#D4C4B0"
            strokeWidth="1"
          />
        </g>
      )}
    </g>
  );
};
