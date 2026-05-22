import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sign In",
  description: `Sign in to ${siteConfig.name} and get personalized ATS feedback on your resume.`,
  alternates: {
    canonical: "/login",
  },
  openGraph: {
    title: `Sign In | ${siteConfig.name}`,
    description: `Sign in to ${siteConfig.name} and get personalized ATS feedback on your resume.`,
    url: absoluteUrl("/login"),
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
