import { forwardRef, HTMLAttributes, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  borderColor?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, borderColor, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative bg-paper rounded-xl overflow-hidden',
          'border border-stone-200/80',
          'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)]',
          hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer',
          hover && 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity',
          className
        )}
        style={borderColor ? { borderColor } : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = ({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div className={cn('px-6 py-4 border-b border-stone-100', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLHeadingElement>>) => (
  <h3 className={cn('text-lg font-semibold text-ink tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLParagraphElement>>) => (
  <p className={cn('text-sm text-ink/60 mt-1 leading-relaxed', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div className={cn('px-6 py-4', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div className={cn('px-6 py-4 border-t border-stone-100 bg-stone-50/50', className)} {...props}>
    {children}
  </div>
);
