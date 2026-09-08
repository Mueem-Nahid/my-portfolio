import { Badge } from "@/components/atoms/Badge";
import { cx } from "@/lib/cx";

type SkillChipProps = {
  label: string;
  className?: string;
};

/** Stack-section chip — slightly larger than a ProjectTag, hover warms the border. */
export function SkillChip({ label, className }: SkillChipProps) {
  return (
    <Badge
      className={cx(
        "px-2.5 py-1 text-[13px] transition-colors hover:border-warm/40 hover:text-ink",
        className,
      )}
    >
      {label}
    </Badge>
  );
}
