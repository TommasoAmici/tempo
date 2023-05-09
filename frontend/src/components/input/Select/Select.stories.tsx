import { CalendarIcon } from "@primer/octicons-react";
import type { Meta, StoryObj } from "@storybook/react";
import { userEvent } from "@storybook/testing-library";
import { sizes } from "../sizes";
import { Select } from "./Select";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Select> = {
  component: Select,
  tags: ["autodocs"],
  args: {
    options: [
      { value: "1", label: "Option 1" },
      { value: "2", label: "Option 2" },
      { value: "3", label: "Option 3" },
    ],
    className: "w-64",
    placeholder: "Select an option",
  },
  argTypes: {
    size: {
      options: sizes,
      control: { type: "radio" },
    },
  },
  render: args => <Select {...args} />,
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Primary: Story = {};

export const PrimaryFocused: Story = {
  ...Primary,
  play: async ({ step }) => {
    await step("Press tab", async () => {
      userEvent.tab();
    });
  },
};

export const Variants: Story = {
  argTypes: {
    size: { control: false },
  },
  render: args => (
    <div className="flex flex-col gap-4">
      {sizes.map(size => (
        <Select {...args} key={size} size={size} />
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    Icon: CalendarIcon,
  },
  argTypes: {
    size: { control: false },
  },
  render: args => (
    <div className="flex flex-col gap-4">
      {sizes.map(size => (
        <Select {...args} key={size} size={size} />
      ))}
    </div>
  ),
};
