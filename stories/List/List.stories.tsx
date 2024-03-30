import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card, ThemeProvider, theme } from "@chakra-ui/react";
import { List } from "./index";

const meta: Meta<typeof List> = {
  component: List,
  title: "molecules/List",
};
export default meta;
type Story = StoryObj<typeof List>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Wrapper = (Story: any) => (
  <ThemeProvider theme={theme}>
    <Story />
  </ThemeProvider>
);

export const ListWithItems: Story = {
  args: {
    type: "vertical",
    items: [
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
      { id: "3", name: "Item 3" },
    ],
    // @ts-ignore
    ItemComponent: (item: { id: string; name: string }) => (
      <Card key={item.id}>{item.name}</Card>
    ),
  },
  decorators: [Wrapper],
};

function ItemCard({ id, name }: { id: string; name: string }) {
  return (
    <Card key={id} p={2}>
      {name}
    </Card>
  );
}

export const ListWithComponent: Story = {
  args: {
    type: "horizontal",
    items: [
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
      { id: "3", name: "Item 3" },
    ],
    // @ts-ignore
    ItemComponent: ItemCard,
  },
  decorators: [Wrapper],
};
