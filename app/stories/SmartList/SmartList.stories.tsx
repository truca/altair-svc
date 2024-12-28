import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, theme } from "@chakra-ui/react";
import { SmartListWrapper as SmartList } from "./index";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const meta: Meta<typeof SmartList> = {
  component: SmartList,
  title: "molecules/SmartList",
};
export default meta;
type Story = StoryObj<typeof SmartList>;

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const Wrapper = (Story: any) => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export const BaseSmartList: Story = {
  args: {
    entityType: "book",
  },
  decorators: [Wrapper],
};

export const SmartListWithControls: Story = {
  args: {
    entityType: "book",
    controls: ["page"],
  },
  decorators: [Wrapper],
};

export const SmartListWithInitialPageAndPageSize: Story = {
  args: {
    entityType: "book",
    initialPage: 2,
    initialPageSize: 10,
    controls: ["page", "pageSize"],
  },
  decorators: [Wrapper],
};
