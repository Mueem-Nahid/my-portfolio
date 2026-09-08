import { cx } from "@/lib/cx";

type GlassPanelProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * The one reusable frosted-glass surface (§5.1) — floating elements only:
 * sticky nav, hero status card, tooltips. `.glass` carries a solid
 * fallback when backdrop-filter is unsupported (§5.5).
 */
export function GlassPanel({ children, className }: GlassPanelProps) {
  return <div className={cx("glass rounded-xl", className)}>{children}</div>;
}
