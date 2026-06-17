import { schools, getSchoolById, getSchoolsByDynasty, getMainSchools, getChildSchools } from '@/data/schools';
import { philosophers, getPhilosopherById, getPhilosophersBySchool } from '@/data/philosophers';
import { works, getWorkById, getWorksByAuthor, getWorksBySchool } from '@/data/works';
import { relations, getRelationsByEntity, getRelationsByType, getPathBetweenEntities } from '@/data/relations';
import { timelineEvents, getTimelineEventsByPhilosopher, getTimelineEventsBySchool } from '@/data/timeline';
import { School, Philosopher, Work, Relation, DynastyPeriod, TimelineEvent } from '@/types';

export const dataService = {
  getAllSchools: (): School[] => schools,
  getSchoolById,
  getSchoolsByDynasty,
  getMainSchools,
  getChildSchools,

  getAllPhilosophers: (): Philosopher[] => philosophers,
  getPhilosopherById,
  getPhilosophersBySchool,

  getAllWorks: (): Work[] => works,
  getWorkById,
  getWorksByAuthor,
  getWorksBySchool,

  getAllRelations: (): Relation[] => relations,
  getRelationsByEntity,
  getRelationsByType,
  getPathBetweenEntities,

  getFilteredSchools: (period: DynastyPeriod, searchTerm: string): School[] => {
    let result = getSchoolsByDynasty(period);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(term) ||
             s.description.toLowerCase().includes(term) ||
             s.coreIdeas.some(idea => idea.toLowerCase().includes(term))
      );
    }
    return result;
  },

  getSchoolWithPhilosophers: (schoolId: string) => {
    const school = getSchoolById(schoolId);
    if (!school) return null;
    const schoolPhilosophers = getPhilosophersBySchool(schoolId);
    const schoolWorks = getWorksBySchool(schoolId);
    const schoolRelations = getRelationsByEntity(schoolId);
    return {
      school,
      philosophers: schoolPhilosophers,
      works: schoolWorks,
      relations: schoolRelations,
    };
  },

  getPhilosopherWithDetails: (philosopherId: string) => {
    const philosopher = getPhilosopherById(philosopherId);
    if (!philosopher) return null;
    const school = getSchoolById(philosopher.schoolId);
    const philosopherWorks = getWorksByAuthor(philosopherId);
    const philosopherRelations = getRelationsByEntity(philosopherId);
    return {
      philosopher,
      school,
      works: philosopherWorks,
      relations: philosopherRelations,
    };
  },

  searchAll: (term: string): { schools: School[]; philosophers: Philosopher[] } => {
    const lowerTerm = term.toLowerCase();
    const matchedSchools = schools.filter(
      s => s.name.toLowerCase().includes(lowerTerm) ||
           s.description.toLowerCase().includes(lowerTerm) ||
           s.coreIdeas.some(idea => idea.toLowerCase().includes(lowerTerm))
    );
    const matchedPhilosophers = philosophers.filter(
      p => p.name.toLowerCase().includes(lowerTerm) ||
           p.biography.toLowerCase().includes(lowerTerm) ||
           p.coreIdeas.some(idea => idea.toLowerCase().includes(lowerTerm))
    );
    return { schools: matchedSchools, philosophers: matchedPhilosophers };
  },

  getAllTimelineEvents: (): TimelineEvent[] => timelineEvents,
  getTimelineEventsByPhilosopher,
  getTimelineEventsBySchool,

  getFilteredTimelineEvents: (period: DynastyPeriod, schoolIds: string[]): TimelineEvent[] => {
    let result = timelineEvents;
    if (period !== 'all') {
      result = result.filter((event) => {
        if (event.schoolId) {
          const school = getSchoolById(event.schoolId);
          return school?.dynasty === period;
        }
        if (event.philosopherId) {
          const philosopher = getPhilosopherById(event.philosopherId);
          const dynastyToPeriodMap: Record<string, DynastyPeriod> = {
            '春秋': 'pre-qin',
            '战国': 'pre-qin',
            '春秋末战国初': 'pre-qin',
            '西汉': 'han',
            '东汉': 'han',
            '两汉': 'han',
            '曹魏': 'wei-jin',
            '魏晋': 'wei-jin',
            '西晋': 'wei-jin',
            '东晋': 'wei-jin',
            '唐代': 'tang',
            '隋唐': 'tang',
            '北宋': 'song-ming',
            '南宋': 'song-ming',
            '宋代': 'song-ming',
            '明代': 'song-ming',
            '宋明': 'song-ming',
          };
          if (philosopher) {
            return dynastyToPeriodMap[philosopher.dynasty] === period;
          }
        }
        return false;
      });
    }
    if (schoolIds.length > 0) {
      result = result.filter((event) => event.schoolId && schoolIds.includes(event.schoolId));
    }
    return result;
  },
};
