import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  className?: string;
}

export function Empty({ icon: Icon, title, description, className }: EmptyProps) {
  return (
    <div className={cn('flex h-full items-center justify-center', className)}>
      <div className="text-center max-w-sm px-4">
        {Icon && (
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-stone-100 flex items-center justify-center">
            <Icon className="w-8 h-8 text-ink/30" />
          </div>
        )}
        {title && (
          <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-ink/50">{description}</p>
        )}
      </div>
    </div>
  );
}

export default Empty;
