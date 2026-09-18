import { CreditCard, Layout, Sparkles, type LucideIcon } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Heading } from "@/components/atoms/Heading";
import { Icon } from "@/components/atoms/Icon";
import { Text } from "@/components/atoms/Text";
import type { Service } from "@/lib/content";

const ICONS: Record<string, LucideIcon> = {
  layout: Layout,
  sparkles: Sparkles,
  "credit-card": CreditCard,
};

type ServiceCardProps = {
  service: Service;
  /** Per-card CTA — mailto or Fiverr gig link set by the owner */
  ctaHref: string;
  ctaLabel?: string;
};

/** One hireable service with its own CTA — no scroll-to-bottom required. */
export function ServiceCard({ service, ctaHref, ctaLabel = "Get a quote" }: ServiceCardProps) {
  const Lucide = ICONS[service.icon] ?? Layout;

  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-panel p-5 transition-transform duration-200 ease-out hover:scale-[1.015] hover:border-warm/30 motion-reduce:transition-none motion-reduce:hover:transform-none">
      <Icon icon={Lucide} size={20} className="text-warm" />
      <Heading as="h3" size="sm" className="mt-3">
        {service.title}
      </Heading>
      <Text tone="muted" size="sm" className="mt-2">
        {service.summary}
      </Text>
      <ul className="mt-4 space-y-1.5">
        {service.deliverables.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted">
            <span aria-hidden="true" className="mt-1.5 size-1 shrink-0 rounded-full bg-signal" />
            {item}
          </li>
        ))}
      </ul>
      <Text as="p" mono tone="muted" className="mt-4 text-xs">
        {service.timeline}
      </Text>
      <div className="mt-auto pt-5">
        <Button href={ctaHref} variant="ghost" size="sm">
          {ctaLabel}
        </Button>
      </div>
    </article>
  );
}
