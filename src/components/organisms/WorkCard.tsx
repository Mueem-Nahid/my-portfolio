import Image from "next/image";
import NextLink from "next/link";
import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { ProjectTag } from "@/components/molecules/ProjectTag";
import { cx } from "@/lib/cx";
import type { Project } from "@/lib/content";

const sizeClasses: Record<Project["size"], string> = {
  "1x1": "",
  "2x1": "sm:col-span-2",
  "1x2": "lg:row-span-2",
  "2x2": "sm:col-span-2 lg:row-span-2",
};

type WorkCardProps = {
  project: Project;
};

/**
 * One bento cell. Motion responds to the user only (§5.4): subtle scale +
 * border glow on hover (devices with a real pointer), no scroll-triggered
 * reveals. Links to /work/[slug] only when the project has an MDX body.
 */
export function WorkCard({ project }: WorkCardProps) {
  const showImage = project.image !== "" && project.size !== "1x1";

  const classes = cx(
    "group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel p-5 transition-transform duration-200 ease-out",
    "hover:scale-[1.015] hover:border-warm/30 hover:shadow-[0_0_32px_rgba(242,165,90,0.08)]",
    "motion-reduce:transition-none motion-reduce:hover:transform-none",
    sizeClasses[project.size],
  );

  const body = (
    <>
      {showImage ? (
        <div className="relative -mx-5 -mt-5 mb-4 aspect-[3/2] overflow-hidden border-b border-line lg:aspect-auto lg:h-36">
          <Image
            src={project.image}
            alt={`${project.title} cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
            className="object-cover"
          />
        </div>
      ) : null}
      <div className="flex items-baseline justify-between gap-3">
        <Heading as="h3" size={project.size === "1x1" ? "sm" : "md"}>
          {project.title}
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
      {project.hasBody ? (
        <Text
          as="span"
          mono
          className="mt-3 text-xs text-warm opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          View case study
        </Text>
      ) : null}
    </>
  );

  if (project.hasBody) {
    return (
      <NextLink href={`/work/${project.slug}`} className={classes}>
        {body}
      </NextLink>
    );
  }
  return <article className={classes}>{body}</article>;
}
