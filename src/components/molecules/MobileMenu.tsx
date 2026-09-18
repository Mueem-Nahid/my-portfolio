"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Icon } from "@/components/atoms/Icon";
import { NavLink } from "@/components/molecules/NavLink";
import type { NavItem } from "@/components/organisms/Navbar";

type MobileMenuProps = {
  items: NavItem[];
};

/**
 * Hamburger menu for <sm viewports — the six inline links would otherwise
 * wrap the sticky header into 2–3 rows. Closes on navigate or Escape.
 */
export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative sm:hidden"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex size-11 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-warm/50"
      >
        <Icon icon={open ? X : Menu} size={20} />
      </button>
      {open ? (
        <ul className="glass absolute top-full right-0 z-50 mt-2 w-56 rounded-xl p-2 shadow-xl">
          {items.map((item) => (
            <li key={item.href}>
              <NavLink
                href={item.href}
                onClick={() => setOpen(false)}
                className="block min-h-11 px-3 py-3 text-base"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
