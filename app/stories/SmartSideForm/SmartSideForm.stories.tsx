import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Button,
  Center,
  ThemeProvider,
  theme,
  useDisclosure,
} from "@chakra-ui/react";
import SmartSideForm from "./index";
import { Direction, FieldType } from "../Form/types";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

function SideFormWrapper({
  title,
  id,
  entityType,
}: {
  title?: string;
  id?: string;
  entityType: string;
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
      <SmartSideForm
        id={id}
        title={title}
        entityType={entityType}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
}

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const meta: Meta<typeof SideFormWrapper> = {
  component: SideFormWrapper,
  title: "molecules/SmartSideForm",
};
export default meta;
type Story = StoryObj<typeof SideFormWrapper>;

const Wrapper = (Story: any) => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export const BaseSmartSideForm: Story = {
  args: {
    entityType: "BOOK",
  },
  decorators: [Wrapper],
};
