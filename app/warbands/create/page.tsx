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
import { gql, useMutation } from "@apollo/client";

const initialState = (
  createWarband: any
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
        onSubmit: (values: FormValue) => {
          console.log("Form submitted:", values);
          const warbandInput = getMutationInputFromFormValues(values);
          createWarband({ variables: warbandInput });
        },
      },
    },
  },
  modals: [],
  sidebars: [],
});

interface FormValue {
  name: string;
  faction: string;
  glory_points: number | string;
  guild_upgrade_points: number | string;
  guild_upgrades: string[];
  isCampaign: boolean;
  isPublic: boolean;
  units: string[];
}

interface MutationInput {
  name: string;
  userId: string;
  faction: string;
  isDraftWarband: boolean;
  gloryPoints: number;
  isPublic: boolean;
  isFinished: boolean;
  guildUpgradePoints: number;
  guildUpgrades: { guildUpgrade: { id: string }; count: number }[];
  units: { unit: { id: string }; count: number }[];
}

function getMutationInputFromFormValues(values: FormValue): MutationInput {
  console.log({ type: typeof values.guild_upgrade_points });
  const { glory_points, guild_upgrade_points } = values;
  return {
    name: values.name,
    userId: "userId",
    isDraftWarband: false,
    faction: values.faction,
    isFinished: true,
    gloryPoints:
      typeof glory_points === "string" ? parseInt(glory_points) : glory_points,
    isPublic: values.isPublic,
    guildUpgradePoints:
      typeof guild_upgrade_points === "string"
        ? parseInt(guild_upgrade_points)
        : guild_upgrade_points,
    guildUpgrades: values.guild_upgrades.map((value) => {
      const [id, cost, tags, amount] = value.split(":");
      return {
        guildUpgrade: { id },
        count: parseInt(amount),
      };
    }),
    units: values.units.map((value) => {
      const [id, cost, amount] = value.split(":");
      return {
        unit: { id },
        count: parseInt(amount),
      };
    }),
  };
}

const createWarbandMutation = gql`
  mutation CreateWarband(
    $name: String!
    $userId: ID!
    $isDraftWarband: Boolean!
    $gloryPoints: Float!
    $isPublic: Boolean!
    $guildUpgradePoints: Float!
    $guildUpgrades: [WarbandGuildUpgradeInputType!]!
    $units: [WarbandUnitInputType!]!
    $faction: String!
  ) {
    createWarband(
      data: {
        name: $name
        userId: $userId
        isDraftWarband: $isDraftWarband
        gloryPoints: $gloryPoints
        isPublic: $isPublic
        guildUpgradePoints: $guildUpgradePoints
        guildUpgrades: $guildUpgrades
        units: $units
        faction: $faction
      }
    ) {
      id
    }
  }
`;

export default function Page() {
  const [createWarband] = useMutation(createWarbandMutation);
  const state = usePageContextReducer(initialState(createWarband));

  return (
    <PageContext.Provider value={state}>
      <DashboardLayout page={state.page} {...(state.slots as any)} />
      <ModalsAndSidebars />
    </PageContext.Provider>
  );
}
