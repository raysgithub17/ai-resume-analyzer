import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  writeBatch,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { AnalysisResult, HistoryEntry } from "@/lib/types";

const MAX_ENTRIES = 50;

function historyCollection(userId: string) {
  return collection(db, "users", userId, "history");
}

function normalizeHistoryEntry(id: string, data: DocumentData): HistoryEntry {
  return {
    id,
    createdAt: typeof data.createdAt === "string" ? data.createdAt : new Date().toISOString(),
    resumeFileName: data.resumeFileName,
    jobDescription: data.jobDescription,
    result: data.result,
  };
}

export async function getHistory(userId: string): Promise<HistoryEntry[]> {
  const historyQuery = query(
    historyCollection(userId),
    orderBy("createdAt", "desc"),
    limit(MAX_ENTRIES)
  );
  const snapshot = await getDocs(historyQuery);

  return snapshot.docs.map((historyDoc) =>
    normalizeHistoryEntry(historyDoc.id, historyDoc.data())
  );
}

export async function saveHistoryEntry(
  userId: string,
  entry: Omit<HistoryEntry, "id" | "createdAt">
): Promise<HistoryEntry> {
  const createdAt = new Date().toISOString();
  const docRef = await addDoc(historyCollection(userId), {
    ...entry,
    createdAt,
  });

  return {
    ...entry,
    id: docRef.id,
    createdAt,
  };
}

export async function deleteHistoryEntry(userId: string, id: string) {
  await deleteDoc(doc(db, "users", userId, "history", id));
}

export async function clearHistory(userId: string) {
  const snapshot = await getDocs(historyCollection(userId));
  const batch = writeBatch(db);

  snapshot.docs.forEach((historyDoc) => {
    batch.delete(historyDoc.ref);
  });

  await batch.commit();
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
