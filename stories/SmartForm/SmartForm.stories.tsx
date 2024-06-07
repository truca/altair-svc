import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, theme } from "@chakra-ui/react";
import { SmartForm } from "./index";
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
    id: "placeholder-id",
    entityType: "AUTHOR",

    debug: false,
    direction: Direction.COLUMN,
    commonFieldProps: {
      inputProps: { colorScheme: "red" } as any,
    },
    onSubmit: (data) => {
      alert(`Values: ${JSON.stringify(data)}`);
    },
    fields: [
      {
        id: "radio",
        label: "Radio",
        type: FieldType.RADIO,
        hasTitle: true,
        direction: Direction.ROW,
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
          { value: "3", label: "Option 3" },
        ],
      },
    ],
  },
  decorators: [Wrapper],
};
