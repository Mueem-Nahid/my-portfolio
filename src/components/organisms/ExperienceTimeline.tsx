import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import { TimelineEntry } from "@/components/molecules/TimelineEntry";
import type { ExperienceEntry } from "@/lib/content";
import { formatPeriod } from "@/lib/format";

type ExperienceTimelineProps = {
  entries: ExperienceEntry[];
};

/**
 * Vertical timeline (§5.3): rail on the left, role + expandable project
 * bullets on the right. Expansion uses native <details> — no JS (§5.4).
 */
export function ExperienceTimeline({ entries }: ExperienceTimelineProps) {
  return (
    <ol className="space-y-12">
      {entries.map((entry) => (
        <li
          key={entry.company}
          className="relative border-l border-line pl-6 sm:pl-8"
        >
          <span
            aria-hidden="true"
            className="absolute top-1.5 -left-[5px] size-[9px] rounded-full border border-line bg-panel"
          />
          <TimelineEntry
            period={formatPeriod(entry.start, entry.end)}
            role={entry.role}
            company={entry.company}
            location={entry.location}
          >
            {entry.projects.map((project) => (
              <details
                key={project.slug}
                className="group rounded-lg border border-line bg-panel/60 open:bg-panel"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:text-warm [&::-webkit-details-marker]:hidden">
                  {project.title}
                  <Icon
                    icon={ChevronRight}
                    size={14}
                    className="shrink-0 text-muted transition-transform group-open:rotate-90"
                  />
                </summary>
                <div className="border-t border-line px-4 py-3">
                  <ul className="list-disc space-y-2 pl-5">
                    {project.highlights.map((highlight) => (
                      <Text as="li" key={highlight} tone="muted" size="sm">
                        {highlight}
                      </Text>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.tech.slice(0, 6).map((tech) => (
                      <Badge key={tech} className="text-[11px]">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </TimelineEntry>
        </li>
      ))}
    </ol>
  );
}
