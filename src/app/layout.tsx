import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Full SEO metadata (OG, JSON-LD, canonical) is wired in Phase 5 via lib/seo.ts.
export const metadata: Metadata = {
  title: "Mueem Nahid Ibn Mahbub — Senior Fullstack Engineer",
  description:
    "Senior fullstack engineer building production SaaS for Japanese clients: billing systems, RAG pipelines, and live tracking platforms.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
