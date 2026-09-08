import { Icon } from "@/components/atoms/Icon";
import { Link } from "@/components/atoms/Link";
import type { LucideIcon } from "lucide-react";

type ContactRowProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
};

/** icon + label + linked value, e.g. email / GitHub / LinkedIn rows. */
export function ContactRow({ icon, label, value, href }: ContactRowProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon icon={icon} size={16} className="shrink-0 text-muted" />
      <span className="w-16 shrink-0 font-mono text-xs text-muted">{label}</span>
      <Link href={href} ariaLabel={`${label}: ${value}`} className="break-all">
        {value}
      </Link>
    </div>
  );
}
