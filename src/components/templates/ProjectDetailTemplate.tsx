import { ChevronLeft, ExternalLink } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
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
    <div className="pt-12 pb-24 sm:pt-16">
      <NextLink
        href="/#work"
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <Icon icon={ChevronLeft} size={14} />
        All work
      </NextLink>

      <header className="mt-8 max-w-prose">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <Heading as="h1" size="xl">
            {project.title}
          </Heading>
        </div>
        <Text as="span" mono tone="muted" className="mt-3 block text-sm">
          {project.period} · {project.role}
        </Text>
        <Text tone="muted" size="lg" className="mt-4">
          {project.summary}
        </Text>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
        {project.liveUrl || project.repoUrl ? (
          <div className="mt-5 flex gap-4">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-warm underline decoration-line underline-offset-4 transition-colors hover:decoration-warm"
              >
                <Icon icon={ExternalLink} size={14} />
                Live site
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink"
              >
                <Icon icon={ExternalLink} size={14} />
                Source
              </a>
            ) : null}
          </div>
        ) : null}
      </header>

      {project.image ? (
        <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-xl border border-line sm:aspect-[2/1]">
          <Image
            src={project.image}
            alt={`${project.title} cover`}
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
      ) : null}

      <div className="mt-10 max-w-prose">{children}</div>
    </div>
  );
}
