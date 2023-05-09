import type { Meta, StoryObj } from "@storybook/react";
import { userEvent } from "@storybook/testing-library";

import { ComponentProps, useState } from "react";
import { Input, sizes, variants } from "./Input";

function InputWithHooks({ value: argValue, ...args }: ComponentProps<typeof Input>) {
  const [value, setValue] = useState(argValue);

  return <Input {...args} value={value} onChange={e => setValue(e.currentTarget.value)} />;
}

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Input> = {
  component: Input,
  tags: ["autodocs"],
  args: {},
  argTypes: {
    value: {
      control: "text",
    },
    variant: {
      options: variants,
      control: { type: "radio" },
    },
    size: {
      options: sizes,
      control: { type: "radio" },
    },
    disabled: {
      control: "boolean",
    },
    required: {
      control: "boolean",
    },
  },
  render: args => <InputWithHooks {...args} />,
};

export default meta;

type Story = StoryObj<typeof Input>;

export const InputForm: Story = {
  args: {
    variant: "form",
  },
};

export const InputFormWithLabel: Story = {
  args: {
    variant: "form",
    label: "Name",
  },
};

export const InputFormValue: Story = {
  args: {
    variant: "form",
    value: "Value",
  },
};

export const InputFormPlaceholder: Story = {
  args: {
    variant: "form",
    placeholder: "Placeholder",
  },
};

export const InputFormFocused: Story = {
  ...InputForm,
  play: async ({ step }) => {
    await step("Press tab", async () => {
      userEvent.tab();
    });
  },
};

export const InputFormDisabled: Story = {
  ...InputForm,
  args: {
    disabled: true,
  },
};

export const InputFormDisabledValue: Story = {
  ...InputForm,
  args: {
    disabled: true,
    value: "Value",
  },
};

export const InputFormDisabledPlaceholder: Story = {
  ...InputForm,
  args: {
    disabled: true,
    placeholder: "Placeholder",
  },
};
