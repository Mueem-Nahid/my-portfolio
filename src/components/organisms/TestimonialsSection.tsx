import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";
import type { Testimonial } from "@/lib/content";

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

/**
 * Renders nothing when content/testimonials/ is empty — never a placeholder
 * or "coming soon" (§4.2). A pure content-add later, zero code changes.
 */
export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {testimonials.map((t) => (
        <figure key={t.slug} className="rounded-xl border border-line bg-panel p-5">
          <blockquote className="text-sm leading-6 text-ink">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-3">
            <Text as="span" size="sm" className="block">
              {t.clientName}
            </Text>
            {t.clientRole ? (
              <Text as="span" mono tone="muted" className="block text-xs">
                {t.clientRole}
              </Text>
            ) : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/** Section wrapper that omits the whole #testimonials block when empty. */
export function TestimonialsBlock({ testimonials }: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-heading" className="scroll-mt-20 pb-24">
      <Heading as="h2" size="lg" id="testimonials-heading" className="mb-8">
        Kind words
      </Heading>
      <TestimonialsSection testimonials={testimonials} />
    </section>
  );
}
