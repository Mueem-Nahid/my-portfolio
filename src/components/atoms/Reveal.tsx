import { cx } from "@/lib/cx";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * The single orchestrated load sequence (§5.4): hero content settles in as
 * one short fade/rise (~500ms), pure CSS — content stays visible if JS never
 * runs, and the global prefers-reduced-motion reset collapses it to instant
 * (§5.5). Everything else on the page is static until interacted with.
 */
export function Reveal({ children, className }: RevealProps) {
  return (
    <div className={cx("animate-hero-reveal", className)}>{children}</div>
  );
}
