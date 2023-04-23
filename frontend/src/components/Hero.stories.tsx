import type { Meta, StoryObj } from "@storybook/react";

import { Hero } from "./Hero";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Hero> = {
  component: Hero,
  tags: ["autodocs"],
  args: {
    heading: "Track your coding activity and own your data",
    description: (
      <p>
        Take charge of your coding activity with Tempo - the open source, self-hosted solution that
        seamlessly integrates with{" "}
        <a
          className="underline"
          target="_blank"
          href="https://wakatime.com/"
          rel="nofollow noopener noreferrer"
        >
          Wakatime
        </a>{" "}
        plugins.
      </p>
    ),
  },
  render: args => <Hero {...args} />,
};

export default meta;

type Story = StoryObj<typeof Hero>;

export const Default: Story = {};

export const WithPrimaryAction: Story = {
  args: {
    primaryAction: <div>Get started</div>,
  },
};

export const WithPrimaryAndSecondaryAction: Story = {
  args: {
    primaryAction: <div>Get started</div>,
    secondaryAction: <div>Learn more</div>,
  },
};
