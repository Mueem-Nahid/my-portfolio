import Image from "next/image";
import NextLink from "next/link";
import { ExternalLink } from "lucide-react";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { ProjectTag } from "@/components/molecules/ProjectTag";
import { cx } from "@/lib/cx";
import type { Project } from "@/lib/content";
import { externalHref } from "@/lib/url";

const sizeClasses: Record<Project["size"], string> = {
  "1x1": "",
  "2x1": "sm:col-span-2",
  "1x2": "lg:row-span-2",
  "2x2": "sm:col-span-2 lg:row-span-2",
};

type WorkCardProps = {
  project: Project;
  /** Pass for the first above-the-fold card image (LCP) */
  imagePriority?: boolean;
};

/**
 * One bento cell. Motion responds to the user only (§5.4): subtle scale +
 * border glow on hover (devices with a real pointer), no scroll-triggered
 * reveals.
 *
 * When the project has an MDX body the title carries a stretched link to
 * /work/[slug], so the whole card stays clickable while a separate live-site
 * link can sit above it (no nested anchors).
 */
export function WorkCard({ project, imagePriority = false }: WorkCardProps) {
  const showImage = project.image !== "" && project.size !== "1x1";
  const hasActions = project.hasBody || project.liveUrl !== "";

  const classes = cx(
    "group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel p-5 transition-transform duration-200 ease-out",
    "hover:scale-[1.015] hover:border-warm/30 hover:shadow-[0_0_32px_rgba(242,165,90,0.08)]",
    "motion-reduce:transition-none motion-reduce:hover:transform-none",
    "focus-within:border-warm/30",
    sizeClasses[project.size],
  );

  return (
    <article className={classes}>
      {showImage ? (
        <div className="relative -mx-5 -mt-5 mb-4 h-44 overflow-hidden border-b border-line sm:h-48 lg:h-36">
          <Image
            src={project.image}
            alt={`${project.title} cover`}
            fill
            {...(imagePriority
              ? { loading: "eager" as const, fetchPriority: "high" as const }
              : {})}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex items-baseline justify-between gap-3">
        <Heading as="h3" size={project.size === "1x1" ? "sm" : "md"}>
          {project.hasBody ? (
            <NextLink
              href={`/work/${project.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {project.title}
            </NextLink>
          ) : (
            project.title
          )}
        </Heading>
        <Text as="span" mono tone="muted" className="shrink-0 text-xs">
          {project.period}
        </Text>
      </div>
      <Text tone="muted" size="sm" className="mt-2 max-w-prose">
        {project.summary}
      </Text>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
        {project.tech.slice(0, project.size === "1x1" ? 4 : 8).map((tech) => (
          <ProjectTag key={tech} name={tech} />
        ))}
      </div>
      {hasActions ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          {project.hasBody ? (
            <Text
              as="span"
              mono
              className="text-xs text-warm opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            >
              View case study
            </Text>
          ) : null}
          {project.liveUrl ? (
            <a
              href={externalHref(project.liveUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 font-mono text-xs text-signal transition-colors hover:text-ink hover:underline"
            >
              <Icon icon={ExternalLink} size={12} />
              Live
              <span className="sr-only"> site (opens in new tab)</span>
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
