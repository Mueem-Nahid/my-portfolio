import { Text } from "@/components/atoms/Text";
import type { FaqEntry } from "@/lib/content";

type FAQSectionProps = {
  faqs: FaqEntry[];
};

/** #faq — freelance-client objections. Native details, CSS-only. Null when empty. */
export function FAQSection({ faqs }: FAQSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <details
          key={faq.q}
          className="group rounded-lg border border-line bg-panel px-5 py-4 open:border-warm/30"
        >
          <summary className="cursor-pointer text-sm font-medium text-ink marker:text-warm">
            {faq.q}
          </summary>
          <Text tone="muted" size="sm" className="mt-2">
            {faq.a}
          </Text>
        </details>
      ))}
    </div>
  );
}
