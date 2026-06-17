import { schools, getSchoolById, getSchoolsByDynasty, getMainSchools, getChildSchools } from '@/data/schools';
import { philosophers, getPhilosopherById, getPhilosophersBySchool } from '@/data/philosophers';
import { works, getWorkById, getWorksByAuthor, getWorksBySchool } from '@/data/works';
import { relations, getRelationsByEntity, getRelationsByType, getPathBetweenEntities } from '@/data/relations';
import { School, Philosopher, Work, Relation, DynastyPeriod } from '@/types';

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
};
