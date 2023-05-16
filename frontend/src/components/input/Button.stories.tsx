import type { Meta, StoryObj } from "@storybook/react";
import { userEvent } from "@storybook/testing-library";

import { CalendarIcon } from "@primer/octicons-react";
import { Button, variants } from "./Button";
import { sizes } from "./sizes";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
  },
  argTypes: {
    as: {
      control: false,
    },
    children: {
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
  },
  render: args => <Button {...args} />,
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const PrimaryFocused: Story = {
  ...Primary,
  play: async ({ step }) => {
    await step("Press tab", async () => {
      userEvent.tab();
    });
  },
};

export const PrimaryDisabled: Story = {
  ...Primary,
  args: {
    disabled: true,
  },
};

export const PrimaryWithIcon: Story = {
  ...Primary,
  args: {
    Icon: CalendarIcon,
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const SecondaryFocused: Story = {
  ...Secondary,
  play: async ({ step }) => {
    await step("Press tab", async () => {
      userEvent.tab();
    });
  },
};

export const SecondaryDisabled: Story = {
  ...Secondary,
  args: {
    ...Secondary.args,
    disabled: true,
  },
};

export const Variants: Story = {
  argTypes: {
    size: { control: false },
    variant: { control: false },
  },
  render: args => (
    <div className="flex flex-col gap-4">
      {sizes.map(size => {
        return (
          <div className="flex gap-4" key={size}>
            {variants.map(variant => {
              return <Button {...args} key={`${variant}-${size}`} variant={variant} size={size} />;
            })}
          </div>
        );
      })}
    </div>
  ),
};
