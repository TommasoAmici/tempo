import { XIcon } from "@primer/octicons-react";
import { Button } from "./input/Button";
import { iconSizeStyles } from "./input/Select/Icon";
import { Size } from "./input/sizes";

type Props = {
  size?: Size;
  onClick: () => void;
  "aria-label": string;
};

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
