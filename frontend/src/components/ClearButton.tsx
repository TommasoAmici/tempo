import { XIcon } from "@primer/octicons-react";
import { IconButton } from "@primer/react";

type Props = {
  onClick: () => void;
  "aria-label": string;
};

/**
 * A to be used for clearing selections or input fields.
 * @param props
 */
export function ClearButton(props: Props) {
  return <IconButton {...props} icon={XIcon} variant="invisible" />;
}
