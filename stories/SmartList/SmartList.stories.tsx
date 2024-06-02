import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, theme } from "@chakra-ui/react";
import { ControlType, SmartList } from "./index";

const meta: Meta<typeof SmartList> = {
  component: SmartList,
  title: "molecules/SmartList",
};
export default meta;
type Story = StoryObj<typeof SmartList>;

const Wrapper = (Story: any) => {
  return (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  );
};

export const BaseSmartList: Story = {
  args: {
    type: "books",
  },
  decorators: [Wrapper],
};

export const SmartListWithControls: Story = {
  args: {
    type: "books",
    controls: [ControlType.Page],
  },
  decorators: [Wrapper],
};
