import type { AnalysisResult, HistoryEntry } from "@/lib/types";

const STORAGE_KEY_PREFIX = "resume-analyzer-history";
const MAX_ENTRIES = 50;

function getStorageKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}:${userId}`;
}

export function getHistory(userId: string): HistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistoryEntry(
  userId: string,
  entry: Omit<HistoryEntry, "id" | "createdAt">
): HistoryEntry {
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  const history = [newEntry, ...getHistory(userId)].slice(0, MAX_ENTRIES);
  localStorage.setItem(getStorageKey(userId), JSON.stringify(history));
  return newEntry;
}

export function deleteHistoryEntry(userId: string, id: string) {
  const history = getHistory(userId).filter((entry) => entry.id !== id);
  localStorage.setItem(getStorageKey(userId), JSON.stringify(history));
}

export function clearHistory(userId: string) {
  localStorage.removeItem(getStorageKey(userId));
}

export function buildReportText(
  result: AnalysisResult,
  resumeFileName?: string
): string {
  const lines = [
    resumeFileName ? `Resume: ${resumeFileName}` : null,
    `ATS Match Score: ${result.score}/100 (${result.matchLabel})`,
    "",
    "Overall Summary",
    result.summary,
    "",
    "Matched Skills",
    ...result.matchedSkills.map((s) => `- ${s}`),
    "",
    "Missing Skills",
    ...result.missingSkills.map((s) => `- ${s}`),
    "",
    "Improvements",
    ...result.improvements.map((s) => `- ${s}`),
    "",
    "Suggestions",
    ...result.suggestions.map((s) => `- ${s}`),
  ];

  return lines.filter((line) => line !== null).join("\n");
}

export function downloadReport(
  result: AnalysisResult,
  resumeFileName?: string
) {
  const blob = new Blob([buildReportText(result, resumeFileName)], {
    type: "text/plain",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume-analysis-report.txt";
  a.click();
  URL.revokeObjectURL(url);
}
