import { GlassPanel } from "@/components/atoms/GlassPanel";
import { StatusDot } from "@/components/atoms/StatusDot";
import { Text } from "@/components/atoms/Text";

type HeroStatusCardProps = {
  statusLine: string;
  location: string;
};

/**
 * The hero's one live/status element (§5.1) — a small floating glass card
 * with the pulsing status dot, echoing the real-time systems he ships.
 */
export function HeroStatusCard({ statusLine, location }: HeroStatusCardProps) {
  return (
    <GlassPanel className="inline-flex items-center gap-3 px-4 py-3">
      <StatusDot label="Currently available and building" />
      <span>
        <Text as="span" size="sm" className="block">
          {statusLine}
        </Text>
        <Text as="span" mono size="sm" tone="muted" className="block text-xs">
          {location}
        </Text>
      </span>
    </GlassPanel>
  );
}
