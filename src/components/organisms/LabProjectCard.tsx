import { ExternalLink } from "lucide-react";
import NextLink from "next/link";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { MetricChip } from "@/components/atoms/MetricChip";
import { StatusPill } from "@/components/atoms/StatusPill";
import { Text } from "@/components/atoms/Text";
import { LabProjectMeta } from "@/components/molecules/LabProjectMeta";
import type { LabProject } from "@/lib/content";
import { externalHref } from "@/lib/url";

type LabProjectCardProps = {
  project: LabProject;
};

/** Compact workbench card — title, one-line summary, chips, links. No big cover. */
export function LabProjectCard({ project }: LabProjectCardProps) {
  return (
    <article className="flex w-[min(18rem,80vw)] shrink-0 snap-start flex-col rounded-xl border border-line bg-panel p-5 transition-transform duration-200 ease-out hover:scale-[1.015] hover:border-warm/30 hover:shadow-[0_0_32px_rgba(242,165,90,0.08)] motion-reduce:transition-none motion-reduce:hover:transform-none sm:w-80">
      <LabProjectMeta tech={project.tech} status={project.status} lastUpdated={project.lastUpdated} />
      <Heading as="h3" size="sm" className="mt-3">
        {project.hasBody ? (
          <NextLink href={`/lab/${project.slug}`}>{project.title}</NextLink>
        ) : (
          project.title
        )}
      </Heading>
      <Text tone="muted" size="sm" className="mt-2">
        {project.summary}
      </Text>
      {project.metrics.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.metrics.map((metric) => (
            <MetricChip key={metric}>{metric}</MetricChip>
          ))}
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {project.tech.map((tech) => (
          <span key={tech} className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] leading-5 text-muted">
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4">
        <StatusPill status={project.status} />
        {project.demoUrl ? (
          <a
            href={externalHref(project.demoUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-signal transition-colors hover:text-ink hover:underline"
          >
            <Icon icon={ExternalLink} size={12} />
            Demo
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        ) : null}
        {project.repoUrl ? (
          <a
            href={externalHref(project.repoUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-ink hover:underline"
          >
            <Icon icon={ExternalLink} size={12} />
            Source
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
