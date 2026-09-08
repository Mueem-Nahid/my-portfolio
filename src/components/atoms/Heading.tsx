import { cx } from "@/lib/cx";

type HeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4";
  size?: "xl" | "lg" | "md" | "sm";
  id?: string;
  className?: string;
  children: React.ReactNode;
};

const sizes = {
  xl: "text-4xl sm:text-5xl font-semibold tracking-tight",
  lg: "text-2xl sm:text-3xl font-semibold tracking-tight",
  md: "text-xl font-semibold tracking-tight",
  sm: "text-base font-semibold",
} as const;

export function Heading({
  as: Tag = "h2",
  size = "lg",
  id,
  className,
  children,
}: HeadingProps) {
  return (
    <Tag id={id} className={cx(sizes[size], "text-ink", className)}>
      {children}
    </Tag>
  );
}
