import { cx } from "classix";

export const variants = ["success", "warning", "danger", "info"] as const;
type Variant = (typeof variants)[number];

function statusCodeToVariant(code: number): Variant {
  if (code >= 500) {
    return "danger";
  }
  if (code >= 400) {
    return "warning";
  }
  if (code >= 200) {
    return "success";
  }
  return "info";
}

const variantStyles: Record<Variant, string> = {
  success: "bg-success-50 border-success-700",
  warning: "bg-warning-50 border-warning-500",
  danger: "bg-danger-50 border-danger-700",
  info: "bg-info-50 border-info-700",
};

type StatusProps = {
  variant?: never;
  status: number;
};

type VariantProps = {
  variant: Variant;
  status?: never;
};

type Props =
  | {
      className?: string;
      children?: React.ReactNode;
    } & (StatusProps | VariantProps);

export function Alert({ status, variant, className, ...props }: Props) {
  return (
    <div
      {...props}
      className={cx(
        "grid place-content-center rounded border-2 px-4 py-2",
        variantStyles[variant ?? statusCodeToVariant(status)],
        className,
      )}
    />
  );
}
