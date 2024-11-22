import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card, GridItem, ThemeProvider, theme } from "@chakra-ui/react";
import { Layout, LayoutProps } from "./index";
import { GridNode } from "./useLayoutElements";

const DESKTOP_LAYOUT: GridNode = {
  type: "grid",
  props: {
    gridTemplateAreas: `"stepper stepper"
    "content sidebar"`,
    maxWidth: "1280px",
    columnGap: "12px",
    rowGap: "24px",
    gridTemplateColumns: "auto 350px",
  },
  items: [
    {
      type: "item",
      area: "stepper",
    },
    {
      type: "grid",
      area: "content",
      props: {
        gridTemplateAreas: `"fpay-header"
"payment-methods"`,
        rowGap: "16px",
        gridAutoRows: "min-content",
      },
      items: [
        { type: "item", area: "fpay-header" },
        { type: "item", area: "payment-methods" },
      ],
    },
    {
      type: "grid",
      area: "sidebar",
      props: {
        gridTemplateAreas: `"summary"
        "invoice-for-desktop"
        "consents"`,
        rowGap: "12px",
      },
      items: [
        { type: "item", area: "summary" },
        { type: "item", area: "invoice-for-desktop" },
        { type: "item", area: "consents" },
      ],
    },
  ],
};

const MOBILE_LAYOUT: GridNode = {
  type: "grid",
  props: {
    gridTemplateAreas: `"stepper"
    "fpay-header"
    "payment-methods"
    "invoice-for-mobile"
    "consents"
    "summary"`,
    rowGap: "12px",
  },
  items: [
    {
      type: "item",
      area: "stepper",
    },
    // If we don't want to show an element on a Layout, we remove it from items
    // { type: 'item', area: 'fpay-header' },
    { type: "item", area: "payment-methods" },
    { type: "item", area: "summary" },
    { type: "item", area: "invoice-for-mobile" },
    { type: "item", area: "consents" },
  ],
};

function PP({ layout }: LayoutProps) {
  return (
    <Layout layout={layout}>
      <GridItem key="stepper" area="stepper">
        <Card p="8px">Stepper</Card>
      </GridItem>
      <GridItem key="payment" area="payment-methods">
        <Card p="8px">payment-methods</Card>
      </GridItem>
      <GridItem key="fpay" area="fpay-header">
        <Card p="8px">fpay-header</Card>
      </GridItem>
      <GridItem key="consents" area="consents">
        <Card p="8px">Consents</Card>
      </GridItem>
      <GridItem key="summary" area="summary">
        <Card p="8px">Summary</Card>
      </GridItem>
      <GridItem key="invoice-1" area="invoice-for-desktop">
        <Card p="8px">Invoice Desktop</Card>
      </GridItem>
      <GridItem key="invoice-2" area="invoice-for-mobile">
        <Card p="8px">Invoice Mobile</Card>
      </GridItem>
    </Layout>
  );
}

const meta: Meta<typeof Layout> = {
  component: PP,
  title: "molecules/Layout",
};
export default meta;
type Story = StoryObj<typeof Layout>;

const Wrapper = (Story: any) => (
  <ThemeProvider theme={theme}>
    <Story />
  </ThemeProvider>
);

export const LayoutDesktop: Story = {
  args: {
    layout: DESKTOP_LAYOUT,
  },
  decorators: [Wrapper],
};

export const LayoutMobile: Story = {
  args: {
    layout: MOBILE_LAYOUT,
  },
  decorators: [Wrapper],
};
