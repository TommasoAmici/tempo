import { cx } from "classix";
import { forwardRef } from "react";

type InputProps = JSX.IntrinsicAttributes &
  React.ClassAttributes<HTMLInputElement> &
  React.InputHTMLAttributes<HTMLInputElement>;

export const variants = ["form"] as const;
type Variant = (typeof variants)[number];

export const sizes = ["small", "medium", "large"] as const;
type Size = (typeof sizes)[number];

type Props = {
  label?: string;
  variant?: Variant;
  size?: Size;
} & Omit<InputProps, "size">;

const variantStyles: Record<Variant, string[]> = {
  form: [
    "border-primary-700 bg-white",
    "focus:ring-primary-500",
    "disabled:border-neutral-300 disabled:bg-neutral-200 disabled:text-neutral-500 disabled:placeholder-neutral-400",
  ],
};

const sizeStyles: Record<Size, string> = {
  small: "text-sm px-1 py-0.5 rounded focus:ring focus:ring-offset-1",
  medium: "text-lg px-2 py-1 rounded focus:ring focus:ring-offset-2",
  large: "text-2xl px-3 py-2 rounded-md focus:ring-4 focus:ring-offset-2",
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className, label, size = "medium", variant = "form", ...props },
  ref,
) {
  const input = (
    <input
      ref={ref}
      {...props}
      className={cx(
        "grid cursor-pointer place-content-center border-2 transition duration-150 focus:outline-none disabled:cursor-not-allowed",
        ...variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    />
  );
  if (label) {
    return (
      <label className="flex flex-col">
        <span className="font-semibold">
          {label}
          {props.required ? " *" : ""}
        </span>
        {input}
      </label>
    );
  } else {
    return input;
  }
});
Input.displayName = "Input";