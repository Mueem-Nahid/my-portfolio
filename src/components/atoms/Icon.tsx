import type { LucideIcon } from "lucide-react";

type IconProps = {
  icon: LucideIcon;
  size?: number;
  className?: string;
};

/** lucide-react wrapper — icons are decorative; label the parent link instead. */
export function Icon({ icon: Lucide, size = 16, className }: IconProps) {
  return (
    <Lucide size={size} strokeWidth={1.75} aria-hidden="true" className={className} />
  );
}
