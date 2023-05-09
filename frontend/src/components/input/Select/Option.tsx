import { CheckIcon } from "@primer/octicons-react";
import cx from "classix";
import { Size } from "../sizes";

const optionSizeStyles: Record<Size, string> = {
  small: "text-sm px-1 py-0.5 first:rounded-t last:rounded-b",
  medium: "text-lg px-2 py-1 first:rounded-t last:rounded-b",
  large: "text-2xl px-3 py-2 first:rounded-t-md last:rounded-b-md",
};

type Props = {
  active?: boolean;
  selected?: boolean;
  children: React.ReactNode;
  size?: Size;
};

export function Option({ active, selected, children, size = "medium" }: Props) {
  return (
    <li
      className={cx(
        "flex cursor-pointer items-center justify-between",
        optionSizeStyles[size],
        active ? "bg-primary-700 text-white" : "bg-white",
      )}
    >
      {children}
      {selected && <CheckIcon className="h-4 w-4" />}
    </li>
  );
}
