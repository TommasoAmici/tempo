import { Listbox } from "@headlessui/react";
import { ChevronDownIcon } from "@primer/octicons-react";
import { cx } from "classix";
import { Button } from "../Button";
import { Size } from "../sizes";
import { iconGapStyles, iconSizeStyles } from "./Icon";
import { Option } from "./Option";

type Value = {
  value: unknown;
  label: string;
};

type Props<T extends Value> = {
  value: T | undefined;
  options: T[];
  setValue: (value: T) => void;
  size?: Size;
  placeholder: string;
  className?: string;
  Icon?: typeof ChevronDownIcon;
  disabled?: boolean;
};

export function Select<T extends Value>({
  size = "medium",
  value,
  setValue,
  options,
  placeholder,
  className,
  Icon,
  disabled,
}: Props<T>) {
  return (
    <Listbox
      as="div"
      className={cx("relative flex flex-col", className)}
      value={value}
      onChange={setValue}
      disabled={disabled}
    >
      <Listbox.Label className="sr-only">{placeholder}</Listbox.Label>
      <Listbox.Button
        as={Button}
        size={size}
        variant="secondary"
        className="w-full place-content-start truncate !text-neutral-900"
      >
        <span className={cx("flex items-center", iconGapStyles[size])}>
          {Icon && <Icon className={iconSizeStyles[size]} />}
          {value?.label ?? placeholder}
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon className="h-5 w-5 text-neutral-600" aria-hidden="true" />
        </span>
      </Listbox.Button>
      <Listbox.Options className="absolute z-50 max-h-64 w-full translate-y-11 transform overflow-y-auto rounded border-2 border-primary-700 bg-white shadow-lg">
        {options.map(option => (
          <Listbox.Option key={option.label} value={option}>
            {({ active, selected }) => (
              <Option active={active} selected={selected} size={size}>
                <span>{option.label}</span>
              </Option>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
}
