import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Center,
  ThemeProvider,
  theme,
  useDisclosure,
} from "@chakra-ui/react";
import BottomSheet from "./index";

function BottomSheetWrapper({ title }: { title: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Center my="5">
        <Button onClick={onOpen}>Open Modal</Button>
      </Center>
      <BottomSheet title={title} isOpen={isOpen} onClose={onClose}>
        <div>Hello world</div>
      </BottomSheet>
    </>
  );
}

const meta: Meta<typeof BottomSheetWrapper> = {
  component: BottomSheetWrapper,
  title: "molecules/BottomSheet",
};
export default meta;
type Story = StoryObj<typeof BottomSheetWrapper>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Wrapper = (Story: any) => {
  return (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  );
};

export const BottomSheetWithText: Story = {
  args: {
    title: "Bottom Sheet",
  },
  decorators: [Wrapper],
};
