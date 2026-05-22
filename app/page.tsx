"use client";

import { useRef, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Download,
  FileText,
  RefreshCw,
  Sparkles,
  Upload,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import {
  AnalysisTip,
  ImprovementsCard,
  MatchedSkillsCard,
  MissingSkillsCard,
  ScoreCard,
  SuggestionsCard,
  SummaryCard,
} from "@/components/analysis/AnalysisGrid";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { downloadReport, saveHistoryEntry } from "@/lib/history";
import type { AnalysisResult } from "@/lib/types";

const MAX_JD_CHARS = 3000;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function EmptyAnalysisState({ loading }: { loading: boolean }) {
  return (
    <Card className="flex min-h-[480px] flex-col items-center justify-center px-8 text-center">
      {loading ? (
        <>
          <Spinner className="h-8 w-8" />
          <h2 className="mt-4 text-base font-medium text-slate-900 dark:text-slate-100">Analyzing...</h2>
          <p className="mt-2 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Our AI is reviewing your resume against the job description.
          </p>
        </>
      ) : (
        <>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-500 dark:bg-violet-950/50 dark:text-violet-400">
            <BarChart3 className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <h2 className="text-base font-medium text-slate-900 dark:text-slate-100">Analysis Summary</h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Upload your resume and paste a job description, then click Analyze Resume
            to see your ATS score and personalized feedback.
          </p>
        </>
      )}
    </Card>
  );
}

export default function AnalyzePage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }
    setResumeFile(file);
    setAnalysis(null);
  }

  async function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!resumeFile) {
      alert("Please upload a PDF resume");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please paste a job description");
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const body = new FormData();
      body.append("resume", resumeFile);

      const analyzeRes = await fetch("/api/analyze", { method: "POST", body });
      const analyzeData = await analyzeRes.json();

      if (!analyzeData.success) {
        alert(analyzeData.error ?? "Failed to analyze resume");
        return;
      }

      const aiRes = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: analyzeData.text,
          jobDescription,
        }),
      });
      const aiData = await aiRes.json();

      if (!aiData.success) {
        alert(aiData.error ?? "Failed to generate ATS analysis");
        return;
      }

      setAnalysis(aiData.result);

      if (user) {
        saveHistoryEntry(user.uid, {
          resumeFileName: resumeFile.name,
          jobDescription,
          result: aiData.result,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const inputForm = (
    <>
      <Card>
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-violet-500" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">1. Upload Resume (PDF)</h3>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        {resumeFile ? (
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500 dark:bg-rose-950/50">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{resumeFile.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatFileSize(resumeFile.size)}</p>
            </div>
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 py-8 text-slate-400 transition hover:border-violet-200 hover:bg-violet-50/30 hover:text-violet-500 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-violet-700 dark:hover:bg-violet-950/30 dark:hover:text-violet-400"
          >
            <Upload className="h-8 w-8" strokeWidth={1.5} />
            <span className="text-sm font-medium">Click to upload PDF</span>
          </button>
        )}

        {resumeFile && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Replace File
          </button>
        )}
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 text-violet-500" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">2. Paste Job Description</h3>
        </div>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value.slice(0, MAX_JD_CHARS))}
          rows={8}
          placeholder="Paste the job description here..."
          className="input-field w-full resize-none rounded-xl px-3.5 py-3 text-sm text-slate-800 placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
        />
        <p className="mt-2 text-right text-xs tabular-nums text-slate-400 dark:text-slate-500">
          {jobDescription.length} / {MAX_JD_CHARS} characters
        </p>
      </Card>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Spinner />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Analyze Resume
          </>
        )}
      </button>
    </>
  );

  return (
    <DashboardLayout>
      <PageHeader
        title="AI Resume Analyzer"
        subtitle="Get AI-powered feedback and improve your chances of getting hired"
        action={
          analysis ? (
            <button
              type="button"
              onClick={() => downloadReport(analysis, resumeFile?.name)}
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-medium text-violet-700 shadow-sm transition hover:bg-violet-50 dark:border-violet-800 dark:bg-slate-800 dark:text-violet-300 dark:hover:bg-violet-950/50"
            >
              <Download className="h-4 w-4" />
              Download Report
            </button>
          ) : undefined
        }
      />

      <form onSubmit={handleOnSubmit}>
        {!analysis ? (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-7">
            <div className="space-y-4">{inputForm}</div>
            <EmptyAnalysisState loading={loading} />
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-3 lg:items-start lg:gap-5">
            <div className="flex flex-col gap-4">
              <Card className="h-fit">
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-violet-500" />
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">1. Upload Resume (PDF)</h3>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-700 dark:bg-slate-800/50">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500 dark:bg-rose-950/50">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{resumeFile?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {resumeFile ? formatFileSize(resumeFile.size) : ""}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                </div>
              </Card>

              <Card>
                <div className="mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-violet-500" />
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">2. Paste Job Description</h3>
                </div>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value.slice(0, MAX_JD_CHARS))}
                  rows={12}
                  readOnly
                  className="input-field w-full resize-none rounded-xl px-3.5 py-3 text-sm text-slate-800 dark:text-slate-200"
                />
                <button
                  type="button"
                  onClick={() => setAnalysis(null)}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Run new analysis
                </button>
              </Card>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:gap-5">
              <ScoreCard analysis={analysis} />
              <SummaryCard analysis={analysis} />
              <MatchedSkillsCard analysis={analysis} />
              <MissingSkillsCard analysis={analysis} />
              <ImprovementsCard analysis={analysis} />
              <SuggestionsCard analysis={analysis} />
              <AnalysisTip analysis={analysis} />
            </div>
          </div>
        )}
      </form>
    </DashboardLayout>
  );
}
