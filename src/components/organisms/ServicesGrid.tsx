import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import { ProcessStep } from "@/components/molecules/ProcessStep";
import { ServiceCard } from "@/components/molecules/ServiceCard";
import type { Service } from "@/lib/content";

const PROCESS_STEPS = [
  "Discovery call — scope and goals",
  "Proposal & timeline in writing",
  "Build with weekly check-ins",
  "Handover & post-launch support",
];

type ServicesGridProps = {
  services: Service[];
  email: string;
};

/** #services — 3 service cards, each with its own CTA, plus process strip. */
export function ServicesGrid({ services, email }: ServicesGridProps) {
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <ServiceCard
            key={service.slug}
            service={service}
            ctaHref={`mailto:${email}?subject=${encodeURIComponent(`Quote request: ${service.title}`)}`}
          />
        ))}
      </div>
      <Heading as="h3" size="sm" className="mt-10 mb-4">
        How we&apos;ll work together
      </Heading>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS_STEPS.map((title, i) => (
          <ProcessStep key={title} index={i} title={title} />
        ))}
      </ol>
      <Text tone="muted" size="sm" className="mt-4">
        Fixed-price for scoped builds, hourly for ongoing work.
      </Text>
    </div>
  );
}
