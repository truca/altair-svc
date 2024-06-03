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
    pluralType: "books",
    singularType: "book",
  },
  decorators: [Wrapper],
};

export const SmartListWithControls: Story = {
  args: {
    pluralType: "books",
    singularType: "book",
    controls: [ControlType.Page],
  },
  decorators: [Wrapper],
};
