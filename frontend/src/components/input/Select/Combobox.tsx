import { Combobox as BaseCombobox, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@primer/octicons-react";
import cx from "classix";
import { Fragment, useState } from "react";

import { Input } from "../Input";
import type { Size } from "../sizes";
import { Option } from "./Option";

type Value = {
  value: unknown;
  label: string;
};

type Props<T extends Value> = {
  disabled?: boolean;
  placeholder: string;
  className?: string;

  value: T | undefined;
  options: T[] | undefined;
  setValue: (value: T) => void;
  size?: Size;
  Icon?: typeof ChevronDownIcon;
};

export function Combobox<T extends Value>({
  disabled,
  className,
  placeholder,

  options,
  value,
  setValue,
  Icon,
  size = "medium",
}: Props<T>) {
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options?.filter(option =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  return (
    <BaseCombobox
      disabled={disabled}
      as="div"
      className={cx("relative", className)}
      value={value}
      onChange={setValue}
    >
      <div className="relative w-full">
        <BaseCombobox.Input
          value={value ? value.label : ""}
          as={Input}
          Icon={Icon}
          size={size}
          placeholder={placeholder}
          className={"w-full truncate pr-6 hover:bg-primary-100 focus:bg-primary-100"}
          onChange={event => setQuery(event.currentTarget.value)}
        />
        <BaseCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronDownIcon className="h-5 w-5 text-neutral-600" aria-hidden="true" />
        </BaseCombobox.Button>
      </div>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setQuery("")}
      >
        <BaseCombobox.Options className="absolute z-50 max-h-64 w-full translate-y-1 transform overflow-y-auto rounded border-2 border-primary-700 bg-white shadow-lg">
          {filteredOptions === undefined ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
              Loading...
            </div>
          ) : filteredOptions.length === 0 && query !== "" ? (
            <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
              Nothing found.
            </div>
          ) : (
            filteredOptions.map(option => (
              <BaseCombobox.Option key={option.label} value={option}>
                {({ active, selected }) => (
                  <Option active={active} selected={selected}>
                    <span>{option.label}</span>
                  </Option>
                )}
              </BaseCombobox.Option>
            ))
          )}
        </BaseCombobox.Options>
      </Transition>
    </BaseCombobox>
  );
}
