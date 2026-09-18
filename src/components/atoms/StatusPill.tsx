import { StatusDot } from "@/components/atoms/StatusDot";
import { cx } from "@/lib/cx";
import type { LabProject } from "@/lib/content";

type StatusPillProps = {
  status: LabProject["status"];
  className?: string;
};

const LABEL: Record<LabProject["status"], string> = {
  live: "Live",
  "in-progress": "In progress",
  archived: "Archived",
};

/** "Live" / "In progress" / "Archived" — reuses the StatusDot pattern. */
export function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[11px] leading-5",
        status === "live" && "border-signal/30 text-signal",
        status === "in-progress" && "border-warm/30 text-warm",
        status === "archived" && "border-line text-muted",
        className,
      )}
    >
      <StatusDot label={LABEL[status]} />
      {LABEL[status]}
    </span>
  );
}
