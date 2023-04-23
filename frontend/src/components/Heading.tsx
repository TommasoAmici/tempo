import { cx } from "classix";

export const sizes = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

type HLevel = (typeof sizes)[number];

type Props = {
  as: HLevel;
  size?: HLevel;
  children: React.ReactNode;
  className?: string;
};

const styles: Record<HLevel, string> = {
  h1: "text-5xl font-bold mb-2",
  h2: "text-4xl font-bold mb-2",
  h3: "text-3xl font-bold mb-1",
  h4: "text-2xl font-semibold mb-1",
  h5: "text-xl font-semibold mb-0.5",
  h6: "text-lg font-semibold mb-0.5",
};

export function Heading({ as, size, children, className }: Props) {
  const Tag = as;
  return <Tag className={cx(styles[size ?? as], className)}>{children}</Tag>;
}
