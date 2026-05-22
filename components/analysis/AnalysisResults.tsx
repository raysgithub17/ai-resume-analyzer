import type { AnalysisResult } from "@/lib/types";
import { downloadReport } from "@/lib/history";
import { ScoreRing } from "@/components/analysis/ScoreRing";
import { SkillTags } from "@/components/analysis/SkillTags";
import { Card } from "@/components/ui/Card";

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2.5">
      {icon}
      <h3 className="text-sm font-medium text-slate-800 dark:text-slate-200">{title}</h3>
    </div>
  );
}

function StatBadge({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "green" | "orange" | "blue";
}) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-900",
    orange: "bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-900",
    blue: "bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-950/50 dark:text-sky-400 dark:ring-sky-900",
  };

  return (
    <span
      className={`rounded-lg px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${tones[tone]}`}
    >
      {label}: {count}
    </span>
  );
}

export function AnalysisResults({
  analysis,
  resumeFileName,
  emptyMessage = "Upload your resume and paste a job description, then click Analyze Resume to see your ATS score and personalized feedback.",
}: {
  analysis: AnalysisResult | null;
  resumeFileName?: string;
  emptyMessage?: string;
}) {
  if (!analysis) {
    return (
      <Card className="flex min-h-[460px] flex-col items-center justify-center px-8 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-400">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-base font-medium text-slate-900 dark:text-slate-100">Analysis Summary</h2>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">{emptyMessage}</p>
      </Card>
    );
  }

  const matchColor =
    analysis.score >= 70
      ? "text-emerald-600 dark:text-emerald-400"
      : analysis.score >= 50
        ? "text-amber-600 dark:text-amber-400"
        : "text-rose-600 dark:text-rose-400";

  const matchDot =
    analysis.score >= 70
      ? "bg-emerald-500"
      : analysis.score >= 50
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-medium text-slate-900 dark:text-slate-100">Analysis Summary</h2>
        <button
          type="button"
          onClick={() => downloadReport(analysis, resumeFileName)}
          className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-700"
        >
          Download Report
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            ATS Match Score
          </p>
          <ScoreRing score={analysis.score} />
          <div className={`mt-4 flex items-center justify-center gap-2 text-sm font-medium ${matchColor}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${matchDot}`} />
            {analysis.matchLabel}
          </div>
        </Card>

        <Card>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Overall Summary
          </p>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{analysis.summary}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <StatBadge label="Strengths" count={analysis.matchedSkills.length} tone="green" />
            <StatBadge label="Missing" count={analysis.missingSkills.length} tone="orange" />
            <StatBadge label="Improvements" count={analysis.improvements.length} tone="blue" />
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card hover>
          <SectionTitle
            icon={
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            }
            title="Matched Skills"
          />
          <SkillTags skills={analysis.matchedSkills} variant="matched" />
        </Card>

        <Card hover>
          <SectionTitle
            icon={
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
        <Card hover>
          <SectionTitle
            icon={
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </span>
            }
            title="Improvements"
          />
          <ul className="space-y-2.5">
            {analysis.improvements.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card hover>
          <SectionTitle
            icon={
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </span>
            }
            title="Suggestions"
          />
          <ul className="space-y-2.5">
            {analysis.suggestions.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-400">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-300 dark:bg-slate-600" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-indigo-100/80 bg-indigo-50/50 px-4 py-3.5 dark:border-indigo-900/50 dark:bg-indigo-950/30">
        <svg className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
        <p className="text-sm leading-relaxed text-indigo-900/80 dark:text-indigo-200/90">
          <span className="font-medium text-indigo-900 dark:text-indigo-200">Tip —</span> Add the missing
          skills and apply the improvements above to boost your shortlist chances.
        </p>
      </div>
    </div>
  );
}
