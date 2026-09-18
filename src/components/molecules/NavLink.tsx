import NextLink from "next/link";
import { cx } from "@/lib/cx";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

/**
 * Nav link — root-relative hashes (/#work) so it works from detail pages
 * too; Next.js handles same-page hashes client-side without a reload.
 */
export function NavLink({ href, children, className, onClick }: NavLinkProps) {
  return (
    <NextLink
      href={href}
      onClick={onClick}
      className={cx(
        "rounded-md px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-ink",
        className,
      )}
    >
      {children}
    </NextLink>
  );
}
