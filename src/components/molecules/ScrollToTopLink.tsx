"use client";

type ScrollToTopLinkProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * "Back to top" — a plain #top anchor is a no-op because the sticky header
 * (id="top") is always visible, so the browser never scrolls. Scroll to 0
 * explicitly instead; href remains as a no-JS fallback.
 */
export function ScrollToTopLink({ children, className }: ScrollToTopLinkProps) {
  return (
    <a
      href="#top"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={className}
    >
      {children}
    </a>
  );
}
