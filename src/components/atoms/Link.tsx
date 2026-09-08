import NextLink from "next/link";
import { cx } from "@/lib/cx";

type LinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

/** Styled link — internal routes/anchors via next/link, external via <a>. */
export function Link({ href, className, children, ariaLabel }: LinkProps) {
  const classes = cx(
    "text-muted underline decoration-line underline-offset-4 transition-colors hover:text-ink hover:decoration-warm",
    className,
  );

  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <NextLink href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </NextLink>
    );
  }
  return (
    <a
      href={href}
      className={classes}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
