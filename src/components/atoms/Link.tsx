import NextLink from "next/link";
import { cx } from "@/lib/cx";
import { externalHref } from "@/lib/url";

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

  // External links open in a new tab; say so for screen readers.
  return (
    <a
      href={externalHref(href)}
      className={classes}
      aria-label={ariaLabel ? `${ariaLabel} (opens in new tab)` : undefined}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      {ariaLabel ? null : <span className="sr-only"> (opens in new tab)</span>}
    </a>
  );
}
