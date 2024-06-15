import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Center,
  ChakraProvider,
  ThemeProvider,
  theme,
  useDisclosure,
} from "@chakra-ui/react";
import SideForm from "./index";
import { Direction, FieldType } from "../Form/types";

function SideFormWrapper({
  title,
  drawer,
  bottomSheet,
}: {
  title: string;
  drawer?: boolean;
  bottomSheet?: boolean;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Center my="5">
        <Button ref={btnRef} onClick={onOpen}>
          Open Modal
        </Button>
      </Center>
      <SideForm
        isOpen={isOpen}
        onClose={onClose}
        form={{
          direction: Direction.COLUMN,
          commonFieldProps: {
            inputProps: { colorScheme: "red" } as any,
          },
          fields: [
            {
              id: "radio",
              label: "Radio",
              type: FieldType.RADIO,
              hasTitle: true,
              direction: Direction.COLUMN,
              options: [
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ],
            },
          ],
          submitText: "Enviar",
          submitProps: { colorScheme: "green", sx: { mt: "60px" } },
          onSubmit: (data) => {
            alert(`Values: ${JSON.stringify(data)}`);
            onClose();
          },
        }}
        {...(drawer
          ? {
              drawer: {
                title,
              },
            }
          : {})}
        {...(bottomSheet
          ? {
              bottomSheet: {
                title,
              },
            }
          : {})}
      />
    </>
  );
}

const meta: Meta<typeof SideFormWrapper> = {
  component: SideFormWrapper,
  title: "molecules/SideForm",
};
export default meta;
type Story = StoryObj<typeof SideFormWrapper>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Wrapper = (Story: any) => {
  return (
    <ChakraProvider>
      <Story />
    </ChakraProvider>
  );
};

export const SideFormOnDrawer: Story = {
  args: {
    title: "Drawer",
    drawer: true,
  },
  decorators: [Wrapper],
};

export const SideFormOnBottomSheet: Story = {
  args: {
    title: "Bottom sheet",
    bottomSheet: true,
  },
  decorators: [Wrapper],
};
