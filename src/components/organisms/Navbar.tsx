import { Button } from "@/components/atoms/Button";
import { NavLink } from "@/components/molecules/NavLink";

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

/** Sticky glass nav — the floating surface the glass treatment is reserved for (§5.1). */
export function Navbar({ name, items, cta }: NavbarProps) {
  return (
    <header id="top" className="glass sticky top-0 z-50 border-x-0 border-t-0">
      <nav
        aria-label="Primary"
        className="mx-auto flex min-h-14 w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 py-2 px-6"
      >
        <a
          href="#top"
          className="shrink-0 text-sm font-semibold tracking-tight text-ink"
        >
          {name}
        </a>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2">
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
      </nav>
    </header>
  );
}
