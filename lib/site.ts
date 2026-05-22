export const siteConfig = {
  name: "AI Resume Analyzer",
  shortName: "Resume Analyzer",
  description:
    "Upload your PDF resume, paste a job description, and get AI-powered ATS feedback with match scores, skill gaps, and actionable improvements.",
  keywords: [
    "resume analyzer",
    "ATS resume checker",
    "AI resume review",
    "job description match",
    "resume score",
    "resume feedback",
    "applicant tracking system",
    "resume optimization",
  ],
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  category: "productivity",
} as const;

export function absoluteUrl(path = "/") {
  const base = siteConfig.url.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}
