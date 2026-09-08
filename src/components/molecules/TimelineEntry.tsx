import { Heading } from "@/components/atoms/Heading";
import { Text } from "@/components/atoms/Text";

type TimelineEntryProps = {
  /** Preformatted, e.g. "Jul 2023 – present" */
  period: string;
  role: string;
  company: string;
  location: string;
  /** Expandable project detail (rendered by the organism) */
  children?: React.ReactNode;
};

/** One role on the experience timeline: years on the left rail, detail right. */
export function TimelineEntry({
  period,
  role,
  company,
  location,
  children,
}: TimelineEntryProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-[8.5rem_1fr] sm:gap-x-10">
      <Text as="span" mono size="sm" tone="muted" className="sm:pt-0.5 sm:text-right">
        {period}
      </Text>
      <div className="min-w-0">
        <Heading as="h3" size="md">
          {role}
        </Heading>
        <Text tone="muted" size="sm" className="mt-1">
          {company} · {location}
        </Text>
        {children ? <div className="mt-4 space-y-2">{children}</div> : null}
      </div>
    </div>
  );
}
