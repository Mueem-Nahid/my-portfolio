import { cx } from "@/lib/cx";

type StatusDotProps = {
  className?: string;
  /** Screen-reader label for the status this dot represents */
  label?: string;
};

/**
 * The pulsing "system online" indicator (§5.1) — the only continuous
 * animation on the page. Pure CSS; disabled under prefers-reduced-motion.
 */
export function StatusDot({ className, label = "Online" }: StatusDotProps) {
  return (
    <span className={cx("relative inline-flex items-center", className)}>
      {/* expanding ring — pure transform/opacity, compositor-only */}
      <span
        aria-hidden="true"
        className="absolute inline-flex size-2 rounded-full bg-signal animate-pulse-dot"
      />
      <span
        aria-hidden="true"
        className="relative inline-flex size-2 rounded-full bg-signal"
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
