export type AnalysisResult = {
  score: number;
  matchLabel: string;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  improvements: string[];
  suggestions: string[];
};

export type HistoryEntry = {
  id: string;
  createdAt: string;
  resumeFileName: string;
  jobDescription: string;
  result: AnalysisResult;
};
