import { cx } from "@/lib/cx";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "neutral" | "signal" | "warm";
  className?: string;
};

/** Tech/stack tag — mono, hairline border, dashboard-style label. */
export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs leading-5",
        tone === "neutral" && "border-line text-muted",
        tone === "signal" && "border-signal/30 text-signal",
        tone === "warm" && "border-warm/30 text-warm",
        className,
      )}
    >
      {children}
    </span>
  );
}
