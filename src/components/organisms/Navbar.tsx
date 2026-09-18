import { Button } from "@/components/atoms/Button";
import { MobileMenu } from "@/components/molecules/MobileMenu";
import { NavLink } from "@/components/molecules/NavLink";
import { ScrollToTopLink } from "@/components/molecules/ScrollToTopLink";

export type NavItem = {
  label: string;
  href: string;
};

type NavbarProps = {
  name: string;
  items: NavItem[];
  /** Persistent nav-level CTA (§4.3) — exactly one, scrolls to #services */
  cta?: NavItem;
};

/** Sticky glass nav — inline links on sm+, hamburger menu below that. */
export function Navbar({ name, items, cta }: NavbarProps) {
  return (
    <header id="top" className="glass sticky top-0 z-50 border-x-0 border-t-0">
      <nav
        aria-label="Primary"
        className="mx-auto flex min-h-14 w-full max-w-6xl items-center justify-between gap-x-4 px-4 py-2 sm:px-6"
      >
        <ScrollToTopLink className="shrink-0 text-sm font-semibold tracking-tight text-ink">
          {name}
        </ScrollToTopLink>
        {/* Desktop: inline links + CTA */}
        <div className="hidden flex-wrap items-center gap-x-1 gap-y-2 sm:flex">
          <ul className="flex flex-wrap items-center justify-end gap-x-1">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
          {cta ? (
            <Button href={cta.href} variant="primary" size="sm" className="ml-2">
              {cta.label}
            </Button>
          ) : null}
        </div>
        {/* Mobile: persistent CTA + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          {cta ? (
            <Button href={cta.href} variant="primary" size="sm">
              {cta.label}
            </Button>
          ) : null}
          <MobileMenu items={items} />
        </div>
      </nav>
    </header>
  );
}
