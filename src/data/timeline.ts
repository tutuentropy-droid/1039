import { TimelineEvent } from '@/types';
import { philosophers } from './philosophers';
import { works } from './works';
import { schools } from './schools';

export const generateTimelineEvents = (): TimelineEvent[] => {
  const events: TimelineEvent[] = [];
  let eventId = 0;

  const parseYear = (yearStr: string): number => {
    if (!yearStr) return 0;
    const clean = yearStr.replace(/年|约|前后|世纪/g, '').trim();
    const match = clean.match(/前?\s*(\d+)/);
    if (match) {
      const year = parseInt(match[1]);
      return clean.includes('前') ? -year : year;
    }
    return 0;
  };

  philosophers.forEach((philosopher) => {
    const birthYearNum = parseYear(philosopher.birthYear);
    events.push({
      id: `timeline-${eventId++}`,
      year: philosopher.birthYear,
      title: `${philosopher.name} 诞生`,
      description: `${philosopher.dynasty}时期著名思想家，${philosopher.biography.slice(0, 50)}...`,
      philosopherId: philosopher.id,
      schoolId: philosopher.schoolId,
    });

    events.push({
      id: `timeline-${eventId++}`,
      year: philosopher.deathYear,
      title: `${philosopher.name} 逝世`,
      description: `享年${Math.abs(parseYear(philosopher.deathYear) - birthYearNum)}岁，留下了${philosopher.works.join('、')}等不朽著作。`,
      philosopherId: philosopher.id,
      schoolId: philosopher.schoolId,
    });
  });

  works.forEach((work) => {
    events.push({
      id: `timeline-${eventId++}`,
      year: work.year,
      title: `《${work.title.replace(/[《》]/g, '')}》问世`,
      description: work.description.slice(0, 60) + '...',
      philosopherId: work.authorId,
      schoolId: work.schoolId,
    });
  });

  schools.forEach((school) => {
    if (!school.parentId) {
      events.push({
        id: `timeline-${eventId++}`,
        year: school.period,
        title: `${school.name}学派形成`,
        description: school.description.slice(0, 60) + '...',
        schoolId: school.id,
      });
    }
  });

  events.sort((a, b) => parseYear(a.year) - parseYear(b.year));

  return events;
};

export const timelineEvents: TimelineEvent[] = generateTimelineEvents();

export const getTimelineEvents = (): TimelineEvent[] => timelineEvents;

export const getTimelineEventsByPhilosopher = (philosopherId: string): TimelineEvent[] => {
  return timelineEvents.filter((e) => e.philosopherId === philosopherId);
};

export const getTimelineEventsBySchool = (schoolId: string): TimelineEvent[] => {
  return timelineEvents.filter((e) => e.schoolId === schoolId);
};
