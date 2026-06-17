import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'outline' | 'solid';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  color?: string;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', color, children, ...props }, ref) => {
    const baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors';

    const variants: Record<BadgeVariant, string> = {
      default: 'bg-stone-100 text-ink/80',
      outline: 'border border-stone-300 text-ink/70 bg-transparent',
      solid: 'text-white',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyle, variants[variant], className)}
        style={variant === 'solid' && color ? { backgroundColor: color } : undefined}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
