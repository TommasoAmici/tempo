import { XIcon } from "@primer/octicons-react";
import type { ComponentProps } from "react";

import { Button } from "./input/Button";
import { iconSizeStyles } from "./input/Select/Icon";

type Props = Omit<ComponentProps<typeof Button>, "children">;

/**
 * A to be used for clearing selections or input fields.
 * @param props
 */
export function ClearButton({ size = "medium", ...props }: Props) {
  return (
    <Button {...props} variant="invisible">
      <XIcon className={iconSizeStyles[size]} />
    </Button>
  );
}
