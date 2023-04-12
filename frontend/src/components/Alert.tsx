import { Flash } from "@primer/react";
import { ComponentProps } from "react";

function statusCodeToVariant(error: number | undefined) {
  if (error === undefined) {
    return undefined;
  }

  if (error >= 500) {
    return "danger";
  }
  if (error >= 400) {
    return "warning";
  }
  if (error >= 200) {
    return "success";
  }
  return undefined;
}

type Props = ComponentProps<typeof Flash> & {
  status?: number;
};

export function Alert({ status, ...props }: Props) {
  return <Flash {...props} variant={statusCodeToVariant(status)} />;
}
