import { cx } from "classix";
import Link from "next/link";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof Link>;

export function HeaderLink({ children, className, ...props }: Props) {
  return (
    <Link {...props} className={cx("font-bold text-white", className)}>
      {children}
    </Link>
  );
}
