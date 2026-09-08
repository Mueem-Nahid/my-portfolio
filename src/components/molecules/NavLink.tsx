import { cx } from "@/lib/cx";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/** Nav anchor link — sentence case, muted until hovered. */
export function NavLink({ href, children, className }: NavLinkProps) {
  return (
    <a
      href={href}
      className={cx(
        "rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-ink",
        className,
      )}
    >
      {children}
    </a>
  );
}
