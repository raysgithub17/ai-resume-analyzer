import { FileText, Sparkles } from "lucide-react";

type AppLogoProps = {
  showText?: boolean;
  compact?: boolean;
  onClick?: () => void;
  className?: string;
};

export function LogoIcon({ compact = false }: { compact?: boolean }) {
  const size = compact ? "h-9 w-9" : "h-10 w-10";

  return (
    <div
      className={`${size} relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-indigo-200/60 dark:shadow-indigo-900/40`}
    >
      <FileText className={compact ? "h-4 w-4" : "h-5 w-5"} strokeWidth={2} />
    </div>
  );
}

export function AppLogo({
  showText = true,
  compact = false,
  onClick,
  className = "",
}: AppLogoProps) {
  const content = (
    <>
      <LogoIcon compact={compact} />
      {showText && (
        <span className="whitespace-nowrap text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
          AI Resume Analyzer
          <Sparkles className="ml-1 inline h-3.5 w-3.5 text-violet-500" />
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Toggle sidebar"
        className={`flex w-full items-center gap-2.5 rounded-xl px-1 py-1 text-left transition hover:bg-violet-50/60 dark:hover:bg-violet-950/40 ${className}`}
      >
        {content}
      </button>
    );
  }

  return <div className={`flex items-center gap-2.5 ${className}`}>{content}</div>;
}
