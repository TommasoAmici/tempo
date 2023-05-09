import { Menu, Transition } from "@headlessui/react";
import cx from "classix";
import { Fragment } from "react";

type Props = {
  button: React.ReactNode;
  items: {
    label: string;
    onClick: () => void;
    Icon?: React.ComponentType<{ className?: string }>;
  }[];
};

export default function Example({ button, items }: Props) {
  return (
    <div className="w-56 text-right">
      <Menu as="div" className="relative z-50 inline-block text-left">
        <Menu.Button>{button}</Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded border-2 border-primary-700 bg-white shadow-lg focus:outline-none">
            {items.map(({ Icon, label, onClick }) => {
              return (
                <Menu.Item key={label}>
                  {({ active }) => (
                    <button
                      className={cx(
                        active
                          ? "bg-primary-700 text-white hover:bg-primary-600"
                          : "text-neutral-900 hover:bg-primary-100",
                        "group flex w-full items-center gap-2 rounded px-2 py-2",
                      )}
                      onClick={onClick}
                    >
                      {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                      {label}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
