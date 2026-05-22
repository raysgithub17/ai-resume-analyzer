export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={`animate-spin text-indigo-500 ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-80"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <main className="app-bg flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
        <Spinner className="h-8 w-8" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </main>
  );
}
