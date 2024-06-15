import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, theme } from "@chakra-ui/react";
import SmartForm from "./index";
import { Direction, FieldType } from "../Form/types";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const meta: Meta<typeof SmartForm> = {
  component: SmartForm,
  title: "molecules/SmartForm",
};
export default meta;
type Story = StoryObj<typeof SmartForm>;

const Wrapper = (Story: any) => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export const BaseSmartForm: Story = {
  args: {
    id: "665d1cf715dbe844897f0b59",
    entityType: "BOOK",

    debug: false,
    direction: Direction.COLUMN,
    commonFieldProps: {
      inputProps: { colorScheme: "red" } as any,
    },
  },
  decorators: [Wrapper],
};
