"use client";

import {
  CheckCircle2,
  FileText,
  Lightbulb,
  Star,
  TrendingUp,
  XCircle,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { ScoreRing } from "@/components/analysis/ScoreRing";
import { SkillTags } from "@/components/analysis/SkillTags";
import { Card } from "@/components/ui/Card";

const resultCardClass = "flex h-full flex-col";

function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="mb-4 flex shrink-0 items-center gap-2">
      {icon}
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
    </div>
  );
}

export function ScoreCard({ analysis }: { analysis: AnalysisResult }) {
  const matchColor =
    analysis.score >= 70
      ? "text-emerald-600"
      : analysis.score >= 50
        ? "text-amber-600"
        : "text-rose-600";

  const matchDot =
    analysis.score >= 70
      ? "bg-emerald-500"
      : analysis.score >= 50
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <Card className={resultCardClass}>
      <SectionHeader
        icon={<FileText className="h-4 w-4 text-violet-500" />}
        title="ATS Match Score"
      />
      <div className="flex flex-1 flex-col justify-center">
        <ScoreRing score={analysis.score} />
        <div className={`mt-3 flex items-center justify-center gap-2 text-sm font-medium ${matchColor}`}>
          <span className={`h-2 w-2 rounded-full ${matchDot}`} />
          {analysis.matchLabel}
        </div>
        {analysis.score >= 70 && (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
            Strong alignment with this role
          </p>
        )}
      </div>
    </Card>
  );
}

export function SummaryCard({ analysis }: { analysis: AnalysisResult }) {
  return (
    <Card className={resultCardClass}>
      <SectionHeader
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        title="Overall Summary"
      />
      <p className="flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{analysis.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2 pt-2">
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
          Strengths: {analysis.matchedSkills.length}
        </span>
        <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
          Missing Skills: {analysis.missingSkills.length}
        </span>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/50 dark:text-sky-400">
          Improvements: {analysis.improvements.length}
        </span>
      </div>
    </Card>
  );
}

export function MatchedSkillsCard({ analysis }: { analysis: AnalysisResult }) {
  return (
    <Card hover className={resultCardClass}>
      <SectionHeader
        icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        title="Matched Skills"
      />
      <div className="flex-1">
        <SkillTags skills={analysis.matchedSkills} variant="matched" />
      </div>
    </Card>
  );
}

export function MissingSkillsCard({ analysis }: { analysis: AnalysisResult }) {
  return (
    <Card hover className={resultCardClass}>
      <SectionHeader
        icon={<XCircle className="h-4 w-4 text-rose-500" />}
        title="Missing Skills"
      />
      <div className="flex-1">
        <SkillTags skills={analysis.missingSkills} variant="missing" />
      </div>
    </Card>
  );
}

export function ImprovementsCard({ analysis }: { analysis: AnalysisResult }) {
  return (
    <Card hover className={resultCardClass}>
      <SectionHeader
        icon={<Lightbulb className="h-4 w-4 text-amber-500" />}
        title="Improvements"
      />
      <ul className="flex-1 space-y-2.5">
        {analysis.improvements.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-400">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function SuggestionsCard({ analysis }: { analysis: AnalysisResult }) {
  return (
    <Card hover className={resultCardClass}>
      <SectionHeader
        icon={<FileText className="h-4 w-4 text-violet-500" />}
        title="Suggestions"
      />
      <ul className="flex-1 space-y-2.5">
        {analysis.suggestions.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-slate-600 dark:text-slate-400">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function AnalysisTip({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="col-span-full flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/80 px-5 py-4 dark:border-sky-900/50 dark:bg-sky-950/30">
      <Star className="mt-0.5 h-4 w-4 shrink-0 fill-sky-400 text-sky-400" />
      <p className="text-sm leading-relaxed text-sky-900/90 dark:text-sky-200/90">
        <span className="font-semibold">Tip:</span> Update your resume with the
        missing skills and improvements above to increase your chances of getting
        shortlisted.
      </p>
    </div>
  );
}
