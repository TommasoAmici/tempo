import { cx } from "classix";

type HLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type Props = {
  as: HLevel;
  size?: HLevel;
  children: React.ReactNode;
  className?: string;
};

const styles: Record<HLevel, string> = {
  h1: "text-4xl mb-2",
  h2: "text-3xl mb-2",
  h3: "text-2xl mb-1",
  h4: "text-xl mb-1",
  h5: "text-lg mb-0.5",
  h6: "text-base mb-0.5",
};

export function Heading({ as, size, children, className }: Props) {
  const Tag = as;
  return <Tag className={cx("font-semibold", styles[size ?? as], className)}>{children}</Tag>;
}
