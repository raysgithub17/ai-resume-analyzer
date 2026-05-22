"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Download, History, Trash2 } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { AnalysisResults } from "@/components/analysis/AnalysisResults";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import {
  clearHistory,
  deleteHistoryEntry,
  downloadReport,
  getHistory,
} from "@/lib/history";
import type { HistoryEntry } from "@/lib/types";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function scoreBadgeClass(score: number) {
  if (score >= 70) return "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-900";
  if (score >= 50) return "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-900";
  return "bg-rose-50 text-rose-600 ring-rose-100 dark:bg-rose-950/50 dark:text-rose-400 dark:ring-rose-900";
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setEntries(getHistory(user.uid));
  }, [user]);

  const selectedEntry = entries.find((entry) => entry.id === selectedId) ?? null;

  function refreshHistory() {
    if (!user) return;
    setEntries(getHistory(user.uid));
  }

  function handleDelete(id: string) {
    if (!user) return;
    deleteHistoryEntry(user.uid, id);
    if (selectedId === id) setSelectedId(null);
    refreshHistory();
  }

  function handleClearAll() {
    if (!user) return;
    if (!confirm("Clear all analysis history?")) return;
    clearHistory(user.uid);
    setSelectedId(null);
    refreshHistory();
  }

  function handleSelect(id: string) {
    setSelectedId(id);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBackToList() {
    setSelectedId(null);
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Analysis History"
        subtitle="View and download your past resume analyses"
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-6">
        <div className={`space-y-3 ${selectedId ? "hidden lg:block" : ""}`}>
          <div className="flex items-center justify-between px-0.5">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <History className="h-3.5 w-3.5" />
              {entries.length} reports
            </p>
            {entries.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 text-xs font-medium text-rose-500 hover:text-rose-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear all
              </button>
            )}
          </div>

          {entries.length === 0 ? (
            <Card className="py-10 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-500 dark:bg-violet-950/50 dark:text-violet-400">
                <Clock className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">No history yet</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Run an analysis and it will appear here.
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {entries.map((entry) => {
                const isSelected = selectedId === entry.id;

                return (
                  <div
                    key={entry.id}
                    className={`card p-4 transition-all duration-150 ${
                      isSelected
                        ? "border-violet-200 ring-2 ring-violet-100 dark:border-violet-800 dark:ring-violet-900/50"
                        : "card-hover"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(entry.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                            {entry.resumeFileName}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                            {formatDate(entry.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold tabular-nums ring-1 ring-inset ${scoreBadgeClass(entry.result.score)}`}
                        >
                          {entry.result.score}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                        {entry.jobDescription}
                      </p>
                      <p className="mt-2 text-xs font-medium text-violet-600 dark:text-violet-400">
                        {entry.result.matchLabel}
                      </p>
                    </button>

                    <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => downloadReport(entry.result, entry.resumeFileName)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Download className="h-3 w-3" />
                        Download
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-100 px-2.5 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={selectedId ? "" : "hidden lg:block"}>
          {selectedId && selectedEntry && (
            <button
              type="button"
              onClick={handleBackToList}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 transition hover:text-violet-700 lg:hidden dark:text-violet-400 dark:hover:text-violet-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to reports
            </button>
          )}

          <AnalysisResults
            analysis={selectedEntry?.result ?? null}
            resumeFileName={selectedEntry?.resumeFileName}
            emptyMessage="Select an analysis from the list to view the full report."
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
