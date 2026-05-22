export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={`card p-5 ${hover ? "card-hover" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function SectionLabel({
  step,
  children,
}: {
  step?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {step !== undefined && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
          {step}
        </span>
      )}
      <span className="text-sm font-medium text-slate-800">{children}</span>
    </div>
  );
}
