import { ChevronLeft, ExternalLink } from "lucide-react";
import NextLink from "next/link";
import { Badge } from "@/components/atoms/Badge";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { ProjectGallery } from "@/components/organisms/ProjectGallery";
import { externalHref } from "@/lib/url";

type DetailTemplateProps = {
  title: string;
  /** Mono meta line, e.g. "2024 · Role" or "in-progress / Python · LangChain / 2026-09" */
  metaLine: string;
  summary: string;
  tech: string[];
  /** Live/demo link slot — demoUrl maps here for /lab */
  liveHref?: string;
  liveLabel?: string;
  sourceHref?: string;
  backHref: string;
  backLabel: string;
  images?: { src: string; alt: string; width: number | null; height: number | null }[];
  children: React.ReactNode;
};

/** Generalized detail layout for /work/[slug] and /lab/[slug] (§6.6). */
export function DetailTemplate({
  title,
  metaLine,
  summary,
  tech,
  liveHref,
  liveLabel = "Live site",
  sourceHref,
  backHref,
  backLabel,
  images = [],
  children,
}: DetailTemplateProps) {
  return (
    <div className="pt-12 pb-24 sm:pt-16">
      <NextLink
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <Icon icon={ChevronLeft} size={14} />
        {backLabel}
      </NextLink>

      <header className="mt-8 max-w-prose">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <Heading as="h1" size="xl">
            {title}
          </Heading>
        </div>
        <Text as="span" mono tone="muted" className="mt-3 block text-sm">
          {metaLine}
        </Text>
        <Text tone="muted" size="lg" className="mt-4">
          {summary}
        </Text>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {tech.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        {liveHref || sourceHref ? (
          <div className="mt-5 flex gap-4">
            {liveHref ? (
              <a
                href={externalHref(liveHref)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-warm underline decoration-line underline-offset-4 transition-colors hover:decoration-warm"
              >
                <Icon icon={ExternalLink} size={14} />
                {liveLabel}
              </a>
            ) : null}
            {sourceHref ? (
              <a
                href={externalHref(sourceHref)}
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

      {images.length > 0 ? (
        <div className="mt-10">
          <ProjectGallery images={images} title={title} />
        </div>
      ) : null}

      <div className="mt-10 max-w-prose">{children}</div>
    </div>
  );
}
