export interface CaseChapter {
  id: string;
  narrative: string;
  objective: string;
  expectedColumns: string[];
  expectedRowCount: number;
  hints: string[];
  successMessage: string;
  partnerOnSuccess: string;
  bonusObjective?: string;
}

export interface CaseData {
  id: string;
  title: string;
  subtitle: string;
  difficulty: 'Rookie' | 'Detective' | 'Senior Detective' | 'Chief';
  estimatedTime: string;
  briefing: string;
  setting: string;
  schema: SchemaTable[];
  seedSQL: string;
  chapters: CaseChapter[];
  solution: {
    suspectName: string;
    suspectRole: string;
    closingNarrative: string;
  };
  evidenceItems: EvidenceItem[];
}

export interface SchemaTable {
  name: string;
  columns: { name: string; type: string; note?: string }[];
}

export interface EvidenceItem {
  id: string;
  unlockedAfterChapter: string;
  type: 'photo' | 'document' | 'note' | 'record';
  label: string;
  content: string;
}

export interface CaseProgress {
  caseId: string;
  completedChapters: string[];
  hintsUsed: number;
  queriesRun: number;
  startedAt: number;
  completedAt?: number;
  rating?: 'Rookie' | 'Detective' | 'Senior Detective' | 'Chief';
}

export type QueryResult = {
  columns: string[];
  rows: any[][];
} | null;
