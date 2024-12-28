"use client";

import { useParams } from "next/navigation";
import { DashboardLayout, ModalsAndSidebars } from "../../components";
import {
  PageContext,
  PageState,
  usePageContextReducer,
} from "../../contexts/PageContext";
import { sidebarCtx } from "../../constants";
import { FieldType } from "@/app/stories/Form/types";

const initialState = (
  faction: string
): PageState<"sidebar" | "logo" | "user" | "content"> => ({
  page: { type: "" },
  slots: {
    sidebar: {
      type: "LinkSidebar",
      ctx: sidebarCtx,
    },
    logo: { type: "Logo" },
    user: { type: "User" },
    content: {
      type: "Form",
      ctx: {
        containerSx: {
          width: "calc(-256px + 100vw)",
          //   margin: "20px 0px 40px",
          display: "flex",
          gap: 6,
          flexFlow: "wrap",
          padding: 8,
          justifyContent: "center",
          alignItems: "center",
        },
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
          // isPublic
          {
            id: "isPublic",
            label: "Public Warband",
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
            defaultValue: ["Guildhall:1:hero:1"],
            validation: {
              type: ["array", "should be an array of strings"],
              required: [true, "this is required"],
            },
            step: 1,
          },
          {
            id: "units",
            label: "Units",
            type: FieldType.MULTISELECT,
            component: "UnitSelect",
            defaultValue: [],
            validation: {
              type: ["array", "should be an array of strings"],
              required: [true, "this is required"],
            },
            step: 2,
          },
        ],
        initialValues: {
          name: "Wild",
          faction: "wild",
          glory_points: 80,
          guild_upgrade_points: 6,
          guild_upgrades: ["Guildhall:1:hero:1"],
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
    },
  },
  modals: [],
  sidebars: [],
});

export default function Page() {
  const params = useParams();
  const faction = params.faction as string;
  const state = usePageContextReducer(initialState(faction));

  return (
    <PageContext.Provider value={state}>
      <DashboardLayout page={state.page} {...(state.slots as any)} />
      <ModalsAndSidebars />
    </PageContext.Provider>
  );
}
