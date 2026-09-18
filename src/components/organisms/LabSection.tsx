"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { LabProjectCard } from "@/components/organisms/LabProjectCard";
import { cx } from "@/lib/cx";
import type { CourseworkEntry, LabProject } from "@/lib/content";

type LabSectionProps = {
  projects: LabProject[];
  coursework: CourseworkEntry[];
};

const FILTER_ORDER = ["All", "AI/ML", "Fullstack"] as const;

type Filter = (typeof FILTER_ORDER)[number];

/**
 * #lab — horizontal-scroll workbench row with a category filter defaulting
 * to AI/ML (the section's story), so the fullstack project reads as "also
 * ships full products" rather than diluting the AI/ML signal.
 * Scroll buttons + native keyboard focus (cards are focusable links) —
 * never scroll-only navigation (§6.8).
 */
export function LabSection({ projects, coursework }: LabSectionProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const categories = FILTER_ORDER.filter(
    (c) => c === "All" || projects.some((p) => p.category === c),
  );
  const [filter, setFilter] = useState<Filter>(
    categories.includes("AI/ML") ? "AI/ML" : "All",
  );
  const visible =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  const scrollBy = (dir: 1 | -1) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({ left: dir * Math.min(row.clientWidth * 0.8, 360), behavior: "smooth" });
  };

  const selectFilter = (next: Filter) => {
    setFilter(next);
    rowRef.current?.scrollTo({ left: 0 });
  };

  return (
    <div>
      {categories.length > 1 ? (
        <div role="group" aria-label="Filter lab projects by category" className="mb-5 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => selectFilter(c)}
              className={cx(
                "inline-flex min-h-11 items-center rounded-md border px-3.5 font-mono text-xs transition-colors",
                filter === c
                  ? "border-warm/50 text-warm"
                  : "border-line text-muted hover:border-warm/30 hover:text-ink",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      ) : null}
      <div className="mb-3 flex items-end justify-between gap-4">
        <Text tone="muted" className="max-w-prose">
          What I&apos;m building outside client work — mostly AI/ML, some of it
          half-finished on purpose.
        </Text>
        {visible.length > 1 ? (
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

      {visible.length > 0 ? (
        <div
          ref={rowRef}
          className="no-scrollbar -m-3 flex snap-x snap-mandatory contain-layout gap-4 overflow-x-auto p-3 motion-reduce:scroll-smooth"
          tabIndex={0}
          role="region"
          aria-label="Personal AI/ML projects"
        >
          {visible.map((project) => (
            <LabProjectCard key={project.slug} project={project} />
          ))}
        </div>
      ) : (
        <Text tone="muted" size="sm">
          No projects in this category yet.
        </Text>
      )}

      {projects.length === 0 ? (
        <Text tone="muted" size="sm">
          First experiments landing soon.
        </Text>
      ) : null}

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
