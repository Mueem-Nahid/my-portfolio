import { Icon } from "@/components/atoms/Icon";
import type { LucideIcon } from "lucide-react";

type SocialIconLinkProps = {
  icon: LucideIcon;
  href: string;
  label: string;
};

/** Icon-only external social link with an accessible label. */
export function SocialIconLink({ icon, href, label }: SocialIconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex rounded-md border border-line p-2 text-muted transition-colors hover:border-warm/50 hover:text-ink"
    >
      <Icon icon={icon} size={18} />
    </a>
  );
}
