import type { Meta, StoryObj } from "@storybook/react";

import { Heading, sizes } from "./Heading";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Heading> = {
  component: Heading,
  tags: ["autodocs"],
  args: {
    as: "h1",
    children: "Heading",
  },
  argTypes: {
    as: {
      control: false,
    },
    className: {
      control: false,
    },
    children: {
      control: "text",
    },
    size: {
      options: sizes,
      control: { type: "radio" },
    },
  },
  render: args => <Heading {...args} />,
};

export default meta;

type Story = StoryObj<typeof Heading>;

export const Default: Story = {};

export const Variants: Story = {
  argTypes: {
    size: { control: false },
  },
  render: args => (
    <div className="flex flex-col gap-4">
      {sizes.map(size => {
        return <Heading {...args} key={size} size={size} />;
      })}
    </div>
  ),
};
