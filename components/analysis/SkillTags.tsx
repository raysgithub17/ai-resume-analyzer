export function SkillTags({
  skills,
  variant,
}: {
  skills: string[];
  variant: "matched" | "missing";
}) {
  const styles =
    variant === "matched"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
      : "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-400";

  if (skills.length === 0) {
    return <p className="text-sm text-slate-400 dark:text-slate-500">None identified</p>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {skills.map((skill) => (
        <span
          key={skill}
          className={`rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
