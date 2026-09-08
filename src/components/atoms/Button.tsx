import { cx } from "@/lib/cx";

type ButtonProps = {
  children: React.ReactNode;
  /** Renders an <a> when set */
  href?: string;
  external?: boolean;
  /** "primary" is the site's single warm-accent CTA style — use sparingly (§5.2) */
  variant?: "primary" | "ghost";
  size?: "md" | "sm";
  className?: string;
};

export function Button({
  children,
  href,
  external,
  variant = "primary",
  size = "md",
  className,
}: ButtonProps) {
  const classes = cx(
    "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors",
    variant === "primary" &&
      "bg-warm text-canvas hover:bg-warm/90",
    variant === "ghost" &&
      "border border-line text-ink hover:border-warm/50 hover:text-warm",
    size === "md" ? "px-5 py-2.5 text-sm" : "px-3.5 py-1.5 text-sm",
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}
