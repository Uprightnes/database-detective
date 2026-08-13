import { CaseData } from '../../types';
import case001 from './case001';
import case002 from './case002';

export const allCases: CaseData[] = [case001, case002];

export const getCaseById = (id: string): CaseData | undefined =>
  allCases.find((c) => c.id === id);
