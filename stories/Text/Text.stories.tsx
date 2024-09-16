import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, theme } from "@chakra-ui/react";
import { Text } from "./index";

const meta: Meta<typeof Text> = {
  component: Text,
  title: "molecules/Text",
};
export default meta;
type Story = StoryObj<typeof Text>;

const Wrapper = (Story: any) => (
  <ThemeProvider theme={theme}>
    <Story />
  </ThemeProvider>
);

export const Tooltip: Story = {
  args: {
    children: "Hola [visible text][tooltip content] Chao",
  },
  decorators: [Wrapper],
};

export const Bold: Story = {
  args: {
    children: "Hola *bold text* Chao",
  },
  decorators: [Wrapper],
};

export const Italic: Story = {
  args: {
    children: "Hola _italic text_ Chao",
  },
  decorators: [Wrapper],
};

export const StrikeThrough: Story = {
  args: {
    children: "Hola ~striked text~ Chao",
  },
  decorators: [Wrapper],
};

export const Code: Story = {
  args: {
    children: "Hola `code text` Chao",
  },
  decorators: [Wrapper],
};
