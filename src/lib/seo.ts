import type { Profile, Project } from "@/lib/content";

/**
 * SEO helpers (docs/requirments.md §8): canonical URLs, JSON-LD structured
 * data. The site URL comes from env so previews/prod stay correct without
 * code changes.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://mueem-nahid.vercel.app")
).replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Person schema on the homepage (§8). */
export function personJsonLd(profile: Profile) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dhaka",
      addressCountry: "BD",
    },
    sameAs: [profile.socials.github, profile.socials.linkedin],
  };
}

/** SoftwareSourceCode schema on each project detail page (§8). */
export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/work/${project.slug}`),
    programmingLanguage: project.tech,
    author: {
      "@type": "Person",
      name: "Mueem Nahid Ibn Mahbub",
      url: SITE_URL,
    },
  };
}
