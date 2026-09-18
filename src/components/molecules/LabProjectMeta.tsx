import { Text } from "@/components/atoms/Text";
import type { LabProject } from "@/lib/content";

type LabProjectMetaProps = {
  tech: LabProject["tech"];
  status: LabProject["status"];
  lastUpdated: LabProject["lastUpdated"];
};

/** Stack + status + last-updated line, monospace — the lab register. */
export function LabProjectMeta({ tech, status, lastUpdated }: LabProjectMetaProps) {
  const stack = tech.slice(0, 4).join(" · ");
  return (
    <Text as="p" mono tone="muted" className="text-[11px] leading-5">
      {status} / {stack}
      {lastUpdated ? ` / ${lastUpdated}` : ""}
    </Text>
  );
}
