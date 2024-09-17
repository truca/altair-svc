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

export const Icon: Story = {
  args: {
    children: "Hola {i|FaBuildingUser} Chao",
  },
  decorators: [Wrapper],
};

export const IconWithTooltip: Story = {
  args: {
    children: "Hola [{i|FaBuildingUser}][Icon!] Chao",
  },
  decorators: [Wrapper],
};

export const BoldAndItalic: Story = {
  args: {
    children: "Hola *_Señor!_* Chao",
  },
  decorators: [Wrapper],
};

export const BoldAndItalicAndStrike: Story = {
  args: {
    children: "Hola *_~Señor!~_* Chao",
  },
  decorators: [Wrapper],
};

export const BoldAndItalicAndStrikeAndTooltipWithIcon: Story = {
  args: {
    children:
      "Hola *_~[Señor! {i|FaBuildingUser}][O Señora! {i|FaBuildingUser}]~_* Chao",
  },
  decorators: [Wrapper],
};
