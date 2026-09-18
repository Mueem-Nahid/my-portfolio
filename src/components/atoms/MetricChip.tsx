import { Badge } from "@/components/atoms/Badge";
import { cx } from "@/lib/cx";

type MetricChipProps = {
  children: React.ReactNode;
  className?: string;
};

/** Small stat, e.g. "92% retrieval accuracy" — mono, dashboard-style. */
export function MetricChip({ children, className }: MetricChipProps) {
  return (
    <Badge tone="signal" className={cx("text-[11px]", className)}>
      {children}
    </Badge>
  );
}
