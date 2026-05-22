import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Analysis History",
  description: `View your past resume analyses and download reports from ${siteConfig.name}.`,
  alternates: {
    canonical: "/history",
  },
  openGraph: {
    title: `Analysis History | ${siteConfig.name}`,
    description: `View your past resume analyses and download reports from ${siteConfig.name}.`,
    url: absoluteUrl("/history"),
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
