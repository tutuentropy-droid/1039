import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { TimelineEvent } from '@/types';

interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  events: TimelineEvent[];
}

export const Timeline = forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, events, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ochre/30 via-ochre/50 to-ochre/30" />
        <div className="space-y-8">
          {events.map((event, index) => (
            <TimelineItem key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    );
  }
);

Timeline.displayName = 'Timeline';

interface TimelineItemProps {
  event: TimelineEvent;
  index: number;
}

const TimelineItem = ({ event, index }: TimelineItemProps) => {
  return (
    <div
      data-event-id={event.id}
      className="relative pl-12 animate-fade-in cursor-pointer group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute left-0 w-8 h-8 rounded-full bg-paper border-2 border-ochre flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
        <div className="w-3 h-3 rounded-full bg-ochre animate-pulse" />
      </div>
      <div className="bg-paper/80 backdrop-blur-sm rounded-xl p-4 border border-stone-200 shadow-sm hover:shadow-md hover:border-ochre/30 hover:bg-ochre/5 transition-all">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-ochre">{event.year}</span>
        </div>
        <h4 className="font-semibold text-ink mb-1 group-hover:text-ochre transition-colors">
          {event.title}
        </h4>
        <p className="text-sm text-ink/60 leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
};
