import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MultiStepForm } from "./MultiStepForm";
import { FieldType } from "./types";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});

const meta: Meta<typeof MultiStepForm> = {
  component: MultiStepForm,
  title: "molecules/MultiStepForm",
};
export default meta;
type Story = StoryObj<typeof MultiStepForm>;

const Wrapper = (Story: any) => (
  <ApolloProvider client={client}>
    <ChakraProvider>
      <Story />
    </ChakraProvider>
  </ApolloProvider>
);

export const DefaultMultiStepForm: Story = {
  args: {
    // debug: true,
    fields: [
      // name
      {
        id: "name",
        label: "Name",
        type: FieldType.TEXT,
        validation: {
          type: ["string", "Name should be a string"],
          required: [true, "Name is required"],
        },
        step: 0,
      },
      // isCampaign
      {
        id: "isCampaign",
        label: "Campaign Warband",
        type: FieldType.CHECKBOX,
        defaultValue: true,
        step: 0,
      },
      // faction
      {
        id: "faction",
        label: "Faction",
        type: FieldType.SELECT,
        placeholder: "Select a faction",
        options: [
          { label: "Chaos", value: "chaos" },
          { label: "Corruption", value: "corruption" },
          { label: "Fortitude", value: "fortitude" },
          { label: "Order", value: "order" },
          { label: "Wild", value: "wild" },
        ],
        step: 0,
      },
      // glory_points
      {
        id: "glory_points",
        label: "Glory Points",
        type: FieldType.NUMBER,
        validation: {
          type: ["number", "should be a number"],
          required: [true, "this is required"],
          min: [80, "should be at least 80"],
        },
        step: 0,
      },
      // guild_upgrades
      {
        id: "guild_upgrade_points",
        label: "Guild Upgrades",
        type: FieldType.NUMBER,
        validation: {
          type: ["number", "should be a number"],
          required: [true, "this is required"],
          min: [0, "should be at least 0"],
        },
        step: 0,
      },
      {
        id: "guild_upgrades",
        label: "Guild Upgrades",
        type: FieldType.MULTISELECT,
        component: "GuildUpgradesSelect",
        defaultValue: ["Guildhall"],
        validation: {
          type: ["array", "should be an array of strings"],
          required: [true, "this is required"],
        },
        step: 1,
      },
      {
        id: "guild_upgrades_2",
        label: "Guild Upgrades",
        type: FieldType.MULTISELECT,
        component: "GuildUpgradesSelect",
        defaultValue: ["Guildhall"],
        validation: {
          type: ["array", "should be an array of strings"],
          required: [true, "this is required"],
        },
        step: 2,
      },
      // {
      //   id: "units",
      //   label: "Units",
      //   type: FieldType.MULTISELECT,
      //   component: "UnitSelect",
      //   defaultValue: [],
      //   validation: {
      //     type: ["array", "should be an array of strings"],
      //     required: [true, "this is required"],
      //   },
      //   step: 2,
      // },
    ],
    initialValues: {
      name: "Wild",
      faction: "wild",
      glory_points: 80,
      guild_upgrade_points: 6,
      guild_upgrades: ["Guildhall"],
    },
    steps: [
      { title: "General Info", description: "Define warband general info" },
      { title: "Guild Upgrades", description: "Select guild upgrades" },
      { title: "Units", description: "Select Units" },
    ],
    onSubmit: (values: Record<string, string>) => {
      console.log("Form submitted:", values);
    },
  },
  decorators: [Wrapper],
};
