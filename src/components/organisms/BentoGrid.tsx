import { WorkCard } from "@/components/organisms/WorkCard";
import type { Project } from "@/lib/content";

type BentoGridProps = {
  projects: Project[];
};

/**
 * Variable-size bento grid (§5.1/§5.3) — cell spans come from each project's
 * frontmatter `size`, so the owner reshapes the grid from markdown.
 * Collapses to a single column under ~640px (§5.5).
 * The first card with an image is above the fold — its image is prioritized
 * so it can be the LCP element without a lazy-load penalty.
 */
export function BentoGrid({ projects }: BentoGridProps) {
  const firstImageIndex = projects.findIndex(
    (p) => p.image !== "" && p.size !== "1x1",
  );

  return (
    <div className="grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(13rem,auto)]">
      {projects.map((project, i) => (
        <WorkCard
          key={project.slug}
          project={project}
          imagePriority={i === firstImageIndex}
        />
      ))}
    </div>
  );
}
