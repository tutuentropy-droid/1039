import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-ink text-paper hover:bg-ink/90 shadow-md hover:shadow-lg',
      secondary: 'bg-stone-200 text-ink hover:bg-stone-300',
      outline: 'border-2 border-ink/30 text-ink hover:bg-ink/5 hover:border-ink/50',
      ghost: 'text-ink/70 hover:text-ink hover:bg-ink/5',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-5 py-2.5',
      lg: 'px-8 py-3.5 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-ochre/50 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'before:absolute before:inset-0 before:rounded-lg before:bg-ink/0 hover:before:bg-ink/5 before:transition-colors',
          'active:scale-[0.98]',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
