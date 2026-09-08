import { Footer } from "@/components/organisms/Footer";
import { Navbar, type NavItem } from "@/components/organisms/Navbar";
import type { Profile } from "@/lib/content";

const NAV_ITEMS: NavItem[] = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

type PageShellProps = {
  profile: Profile;
  children: React.ReactNode;
};

/** Nav + footer + centered max-width container (§5.2: ~1200px, dashboard reading pattern). */
export function PageShell({ profile, children }: PageShellProps) {
  const shortName = profile.name.split(" ").slice(0, 2).join(" ");

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-panel focus:px-3 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>
      <Navbar name={shortName} items={NAV_ITEMS} />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-6">
        {children}
      </main>
      <Footer profile={profile} />
    </>
  );
}
