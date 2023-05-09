import { cx } from "classix";
import Link from "next/link";
import { Size } from "./sizes";

export const variants = ["primary", "secondary", "invisible"] as const;
type Variant = (typeof variants)[number];

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
  invisible: [
    "border-transparent bg-white text-primary-800",
    "hover:bg-primary-100",
    "focus:bg-primary-100 focus:ring-primary-500",
    "disabled:hover:bg-neutral-200 disabled:bg-neutral-200 disabled:text-neutral-500",
  ],
};

const sizeStyles: Record<Size, string> = {
  small: "text-sm px-1 py-0.5 rounded focus:ring focus:ring-offset-1",
  medium: "text-lg px-2 py-1 rounded focus:ring focus:ring-offset-2",
  large: "text-2xl px-3 py-2 rounded-md focus:ring-4 focus:ring-offset-2",
};

function buttonClassName(variant: Variant, size: Size, className?: string) {
  return cx(
    "grid cursor-pointer place-content-center border-2 transition duration-150 focus:outline-none disabled:cursor-not-allowed",
    ...variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

type BaseProps = {
  className?: string;
  size?: Size;
  variant?: Variant;
  children: React.ReactNode;
};

type ButtonProps = BaseProps & {
  as?: React.ElementType;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export function Button({
  as: Component = "button",
  className,
  size = "medium",
  variant = "primary",
  ...props
}: ButtonProps) {
  return <Component {...props} className={buttonClassName(variant, size, className)} />;
}

type ButtonLinkProps = BaseProps & {
  href: string;
};

export function ButtonLink({
  className,
  size = "medium",
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return <Link {...props} className={buttonClassName(variant, size, className)} />;
}
