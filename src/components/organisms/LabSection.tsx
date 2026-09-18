"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { LabProjectCard } from "@/components/organisms/LabProjectCard";
import type { CourseworkEntry, LabProject } from "@/lib/content";

type LabSectionProps = {
  projects: LabProject[];
  coursework: CourseworkEntry[];
};

/**
 * #lab — horizontal-scroll workbench row. Scroll buttons + native keyboard
 * focus (cards are focusable links) — never scroll-only navigation (§6.8).
 */
export function LabSection({ projects, coursework }: LabSectionProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: dir * Math.min(row.clientWidth * 0.8, 360), behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <Text tone="muted" className="max-w-prose">
          What I&apos;m building outside client work — mostly AI/ML, some of it
          half-finished on purpose.
        </Text>
        {projects.length > 1 ? (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Scroll lab projects backward"
              className="inline-flex size-11 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-warm/50 hover:text-ink sm:size-9"
            >
              <Icon icon={ChevronLeft} size={16} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Scroll lab projects forward"
              className="inline-flex size-11 items-center justify-center rounded-md border border-line text-muted transition-colors hover:border-warm/50 hover:text-ink sm:size-9"
            >
              <Icon icon={ChevronRight} size={16} />
            </button>
          </div>
        ) : null}
      </div>

      {projects.length > 0 ? (
        <div
          ref={rowRef}
          className="no-scrollbar flex snap-x snap-mandatory contain-layout gap-4 overflow-x-auto pb-2 motion-reduce:scroll-smooth"
          tabIndex={0}
          role="region"
          aria-label="Personal AI/ML projects"
        >
          {projects.map((project) => (
            <LabProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <Text tone="muted" size="sm">
          First experiments landing soon.
        </Text>
      )}

      {coursework.length > 0 ? (
        <div className="mt-8">
          <Heading as="h3" size="sm" className="mb-3">
            Currently learning
          </Heading>
          <ul className="flex flex-wrap gap-1.5">
            {coursework.map((course) => (
              <li
                key={`${course.provider}-${course.name}`}
                className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] leading-5 text-muted"
              >
                {course.name} · {course.provider} · {course.status}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
