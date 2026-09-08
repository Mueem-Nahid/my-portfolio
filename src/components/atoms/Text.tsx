import { cx } from "@/lib/cx";

type TextProps = {
  as?: "p" | "span" | "li";
  tone?: "primary" | "muted";
  size?: "lg" | "md" | "sm";
  mono?: boolean;
  className?: string;
  children: React.ReactNode;
};

const sizes = {
  lg: "text-lg leading-8",
  md: "text-base leading-7",
  sm: "text-sm leading-6",
} as const;

export function Text({
  as: Tag = "p",
  tone = "primary",
  size = "md",
  mono,
  className,
  children,
}: TextProps) {
  return (
    <Tag
      className={cx(
        sizes[size],
        tone === "primary" ? "text-ink" : "text-muted",
        mono && "font-mono",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
