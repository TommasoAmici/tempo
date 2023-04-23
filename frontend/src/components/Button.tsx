import { cx } from "classix";
import { forwardRef } from "react";

type ButtonProps = JSX.IntrinsicAttributes &
  React.ClassAttributes<HTMLButtonElement> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const variants = ["primary", "secondary"] as const;
type Variant = (typeof variants)[number];

export const sizes = ["small", "medium", "large"] as const;
type Size = (typeof sizes)[number];

type Props = {
  as?: React.ElementType;
  variant?: Variant;
  size?: Size;
} & ButtonProps;

const variantStyles: Record<Variant, string[]> = {
  primary: [
    "shadow-lg border-transparent bg-primary-700 text-white",
    "hover:bg-primary-600",
    "focus:bg-primary-600 focus:ring-primary-500",
    "disabled:hover:bg-primary-700 disabled:opacity-70 disabled:shadow-sm",
  ],
  secondary: [
    "border-primary-700 bg-white text-primary-800",
    "hover:bg-primary-100",
    "focus:bg-primary-100 focus:ring-primary-500",
    "disabled:border-transparent disabled:hover:bg-neutral-200 disabled:bg-neutral-200 disabled:text-neutral-500",
  ],
};

const sizeStyles: Record<Size, string> = {
  small: "text-sm px-1 py-0.5 rounded focus:ring focus:ring-offset-1",
  medium: "text-lg px-2 py-1 rounded focus:ring focus:ring-offset-2",
  large: "text-2xl px-3 py-2 rounded-md focus:ring-4 focus:ring-offset-2",
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, as: Component = "button", size = "medium", variant = "primary", ...props },
  ref,
) {
  return (
    <Component
      ref={ref}
      {...props}
      className={cx(
        "cursor-pointer border-2 transition duration-150 focus:outline-none disabled:cursor-not-allowed",
        ...variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    />
  );
});
Button.displayName = "Button";
