import { Text } from "@/components/atoms/Text";

type ProcessStepProps = {
  index: number;
  title: string;
};

/** One step in the #services process strip — one line, no paragraphs. */
export function ProcessStep({ index, title }: ProcessStepProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-line bg-panel px-4 py-3">
      <Text as="span" mono className="text-sm text-warm">
        {String(index + 1).padStart(2, "0")}
      </Text>
      <Text as="span" size="sm">
        {title}
      </Text>
    </li>
  );
}
