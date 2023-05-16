import { cx } from "classix";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export function Sidebar({ className, children }: Props) {
  return (
    <aside className={cx("sticky top-0 flex flex-col gap-2 bg-neutral-100 px-4 py-8", className)}>
      {children}
    </aside>
  );
}
