import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ResumeAI — ATS-Friendly Resume Builder",
  description: "Build professional, ATS-optimized resumes with AI. Choose from 10 premium templates, upload your existing resume, and let AI enhance it for better job matches.",
  keywords: "resume builder, ATS resume, AI resume, professional resume, resume templates",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
