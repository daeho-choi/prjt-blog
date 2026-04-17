import data from './case-studies.json';

export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  accent: string;
}

export const caseStudies: CaseStudy[] = data as CaseStudy[];
