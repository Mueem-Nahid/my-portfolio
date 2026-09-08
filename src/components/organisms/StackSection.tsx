import { Heading } from "@/components/atoms/Heading";
import { SkillChip } from "@/components/molecules/SkillChip";
import type { StackGroup } from "@/lib/stack";

type StackSectionProps = {
  groups: StackGroup[];
};

/** Technology grouped by real usage (§5.3) — never a flat alphabetical list. */
export function StackSection({ groups }: StackSectionProps) {
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div
          key={group.name}
          className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-x-10"
        >
          <Heading
            as="h3"
            size="sm"
            className="font-mono text-sm font-normal text-muted"
          >
            {group.name}
          </Heading>
          <ul className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <li key={item}>
                <SkillChip label={item} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
