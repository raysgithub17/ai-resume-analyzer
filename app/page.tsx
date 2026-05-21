"use client";

import { useRef, useState } from "react";

const MAX_JD_CHARS = 3000;

type AnalysisResult = {
  score: number;
  matchLabel: string;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  improvements: string[];
  suggestions: string[];
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{score}</span>
        <span className="text-sm text-gray-500">/ 100</span>
      </div>
    </div>
  );
}

function SkillTags({
  skills,
  variant,
}: {
  skills: string[];
  variant: "matched" | "missing";
}) {
  const styles =
    variant === "matched"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : "bg-red-50 text-red-600 border-red-100";

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span
          key={skill}
          className={`rounded-full border px-3 py-1 text-sm font-medium ${styles}`}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {icon}
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

export default function Home() {
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

  function handleJdChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value.slice(0, MAX_JD_CHARS);
    setJobDescription(value);
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
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadReport() {
    if (!analysis) return;
    const report = [
      `ATS Match Score: ${analysis.score}/100 (${analysis.matchLabel})`,
      "",
      "Overall Summary",
      analysis.summary,
      "",
      "Matched Skills",
      ...analysis.matchedSkills.map((s) => `- ${s}`),
      "",
      "Missing Skills",
      ...analysis.missingSkills.map((s) => `- ${s}`),
      "",
      "Improvements",
      ...analysis.improvements.map((s) => `- ${s}`),
      "",
      "Suggestions",
      ...analysis.suggestions.map((s) => `- ${s}`),
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-analysis-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const matchColor =
    analysis && analysis.score >= 70
      ? "text-emerald-600"
      : analysis && analysis.score >= 50
        ? "text-amber-600"
        : "text-red-600";

  const matchDot =
    analysis && analysis.score >= 70
      ? "bg-emerald-500"
      : analysis && analysis.score >= 50
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <main className="min-h-screen bg-[#f4f6f8] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            AI Resume Analyzer
          </h1>
          <p className="mt-2 text-gray-500">
            Get AI-powered feedback and improve your chances of getting hired
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
          {/* Left — Inputs */}
          <form onSubmit={handleOnSubmit} className="space-y-4">
            <Card>
              <label className="mb-3 block text-sm font-semibold text-gray-900">
                1. Upload Resume (PDF)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              {resumeFile ? (
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-500">
                    <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM8 12h8v2H8v-2zm0 4h5v2H8v-2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-gray-900">
                      {resumeFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(resumeFile.size)}
                    </p>
                  </div>
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-8 text-gray-500 transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-600"
                >
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm font-medium">Click to upload PDF</span>
                </button>
              )}

              {resumeFile && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Replace File
                </button>
              )}
            </Card>

            <Card>
              <label
                htmlFor="jobDescription"
                className="mb-3 block text-sm font-semibold text-gray-900"
              >
                2. Paste Job Description
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={handleJdChange}
                rows={8}
                placeholder="Paste the job description here..."
                className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
              <p className="mt-2 text-right text-xs text-gray-400">
                {jobDescription.length} / {MAX_JD_CHARS} characters
              </p>
            </Card>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Analyze Resume
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              Our AI will analyze your resume and job description to give you
              personalized feedback.
            </p>
          </form>

          {/* Right — Results */}
          <div className="space-y-4">
            {!analysis ? (
              <Card className="flex min-h-[480px] flex-col items-center justify-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Analysis Summary
                </h2>
                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  Upload your resume and paste a job description, then click
                  Analyze Resume to see your ATS score and personalized feedback.
                </p>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Analysis Summary
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadReport}
                    className="rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
                  >
                    Download Report
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <h3 className="mb-4 text-sm font-semibold text-gray-700">
                      ATS Match Score
                    </h3>
                    <ScoreRing score={analysis.score} />
                    <div className={`mt-3 flex items-center justify-center gap-2 text-sm font-medium ${matchColor}`}>
                      <span className={`h-2 w-2 rounded-full ${matchDot}`} />
                      {analysis.matchLabel}
                    </div>
                  </Card>

                  <Card>
                    <h3 className="mb-3 text-sm font-semibold text-gray-700">
                      Overall Summary
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {analysis.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        Strengths: {analysis.matchedSkills.length}
                      </span>
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                        Missing Skills: {analysis.missingSkills.length}
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                        Improvements: {analysis.improvements.length}
                      </span>
                    </div>
                  </Card>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <SectionTitle
                      icon={
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      }
                      title="Matched Skills"
                    />
                    <SkillTags skills={analysis.matchedSkills} variant="matched" />
                  </Card>

                  <Card>
                    <SectionTitle
                      icon={
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      }
                      title="Missing Skills"
                    />
                    <SkillTags skills={analysis.missingSkills} variant="missing" />
                  </Card>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Card>
                    <SectionTitle
                      icon={
                        <span className="text-amber-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </span>
                      }
                      title="Improvements"
                    />
                    <ul className="space-y-2 text-sm text-gray-600">
                      {analysis.improvements.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card>
                    <SectionTitle
                      icon={
                        <span className="text-indigo-500">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </span>
                      }
                      title="Suggestions"
                    />
                    <ul className="space-y-2 text-sm text-gray-600">
                      {analysis.suggestions.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Tip:</span> Update your resume
                    with the missing skills and improvements above to increase
                    your chances of getting shortlisted.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
