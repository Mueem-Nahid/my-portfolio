import type { MetadataRoute } from "next";
import { getLabProjectsWithBody, getProjectsWithBody } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

/** Auto-includes every generated /work/[slug] and /lab/[slug] route (§8). */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...getProjectsWithBody().map((project) => ({
      url: absoluteUrl(`/work/${project.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...getLabProjectsWithBody().map((project) => ({
      url: absoluteUrl(`/lab/${project.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
