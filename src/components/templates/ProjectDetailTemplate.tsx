import { DetailTemplate } from "@/components/templates/DetailTemplate";
import type { Project } from "@/lib/content";

type ProjectDetailTemplateProps = {
  project: Project;
  /** Rendered MDX body (problem / approach / outcome) */
  children: React.ReactNode;
};

/** Layout for /work/[slug] (§6) — structure only, no content fetching. */
export function ProjectDetailTemplate({
  project,
  children,
}: ProjectDetailTemplateProps) {
  return (
    <DetailTemplate
      title={project.title}
      metaLine={`${project.period} · ${project.role}`}
      summary={project.summary}
      tech={project.tech}
      liveHref={project.liveUrl || undefined}
      liveLabel="Live site"
      sourceHref={project.repoUrl || undefined}
      backHref="/#work"
      backLabel="All work"
      images={project.images}
    >
      {children}
    </DetailTemplate>
  );
}
