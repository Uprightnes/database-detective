import { CaseData } from '../../types';
import case001 from './case001';
import case002 from './case002';
import case003 from './case003';
import case004 from './case004';

export const allCases: CaseData[] = [case001, case002, case003, case004];

export const getCaseById = (id: string): CaseData | undefined =>
  allCases.find((c) => c.id === id);
