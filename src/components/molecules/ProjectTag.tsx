import { Badge } from "@/components/atoms/Badge";

type ProjectTagProps = {
  name: string;
};

/** Compact tech tag used on project cards. */
export function ProjectTag({ name }: ProjectTagProps) {
  return <Badge className="text-[11px]">{name}</Badge>;
}
