import { ImageResponse } from "next/og";
import { getProjectBySlug, getProjectsWithBody } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getProjectsWithBody().map((project) => ({ slug: project.slug }));
}

export const dynamicParams = false;

/** Per-project OG image (§8) — generated from the project's own content. */
export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  const title = project?.title ?? "Project";
  const summary = project?.summary ?? "";
  const tech = project?.tech.slice(0, 5) ?? [];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0B1220",
        padding: 72,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            backgroundColor: "#34D399",
          }}
        />
        <span style={{ color: "#8B96AB", fontSize: 22 }}>
          Mueem Nahid Ibn Mahbub — case study
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span
          style={{ color: "#E8ECF4", fontSize: 60, fontWeight: 600, letterSpacing: "-0.02em" }}
        >
          {title}
        </span>
        <span style={{ color: "#8B96AB", fontSize: 28, maxWidth: 900 }}>
          {summary}
        </span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {tech.map((t) => (
          <span
            key={t}
            style={{
              color: "#8B96AB",
              fontSize: 20,
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              padding: "6px 14px",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>,
    size,
  );
}
