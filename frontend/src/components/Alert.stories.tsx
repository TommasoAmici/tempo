import type { Meta, StoryObj } from "@storybook/react";

import { Alert, variants } from "./Alert";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Alert> = {
  component: Alert,
  tags: ["autodocs"],
  args: {
    children: "Content of the Alert",
  },
  argTypes: {
    children: {
      control: "text",
    },
    variant: {
      options: variants,
      control: { type: "radio" },
    },
  },
  render: args => <Alert className="w-80" {...args} />,
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: "info",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
  },
};
