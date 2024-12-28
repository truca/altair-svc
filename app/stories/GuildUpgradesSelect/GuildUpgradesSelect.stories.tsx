import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ThemeProvider, theme } from "@chakra-ui/react";
import GuildUpgradesSelect from "./index";

const meta: Meta<typeof GuildUpgradesSelect> = {
  component: GuildUpgradesSelect,
  title: "molecules/GuildUpgradesSelect",
};
export default meta;
type Story = StoryObj<typeof GuildUpgradesSelect>;

const Wrapper = (Story: any) => {
  return (
    <ThemeProvider theme={theme}>
      <Story />
    </ThemeProvider>
  );
};

export const GUs = [
  {
    name: "Guildhall",
    isUnique: true,
    allowsTags: ["hero"],
    allowsTagsMax: 1,
    description:
      "Let you spend GP to recruit Infantry and your first Hero. Provides your first 80 GP.",
    cost: 0,
    image: "./gobo.png",
  },
  {
    name: "Diplomatic Deal",
    isUnique: true,
    allowsTags: [],
    description:
      "Choose an adjacent Force; from now on you are allowed to recruit from this Force.",
    options: [
      {
        name: "Diplomatic Deal (Chaos)",
        allowsTags: ["chaos"],
        cost: 1,
      },
      {
        name: "Diplomatic Deal (Order)",
        allowsTags: ["order"],
        cost: 1,
      },
      {
        name: "Diplomatic Deal (Wild)",
        allowsTags: ["wild"],
        cost: 1,
      },
      {
        name: "Diplomatic Deal (Fortitude)",
        allowsTags: ["fortitude"],
        cost: 1,
      },
      {
        name: "Diplomatic Deal (Corruption)",
        allowsTags: ["corruption"],
        cost: 1,
      },
    ],
    cost: 1,
    image: "./gobo.png",
  },
  {
    name: "Stables",
    isUnique: false,
    allowsTags: ["cavalry"],
    description:
      "Let you spend GP to recruit models with the tag Cavalry, such as horses and non-heroic mounts.",
    cost: 1,
    image: "./gobo.png",
  },
  {
    name: "Workshop",
    isUnique: false,
    allowsTags: ["construct"],
    description:
      "Let you spend GP to recruit models with the tag Construct, such as siege weapons and golems.",
    cost: 1,
    image: "./gobo.png",
  },
  {
    name: "Hero's Quarter",
    isUnique: false,
    allowsTags: ["hero"],
    allowsTagsMax: 1,
    description: "Let you spend GP to recruit one additional 2-Heroism Hero.",
    cost: 1,
    image: "./gobo.png",
  },
  {
    name: "Glorious Hero's Quarter",
    isUnique: true,
    allowsTags: ["glorious hero"],
    allowsTagsMax: 1,
    description:
      "Let you spend GP to recruit one additional epic 3-Heroism Hero.",
    cost: 2,
    image: "./gobo.png",
  },
  {
    name: "Beast Lair",
    isUnique: false,
    allowsTags: ["heroic beast", "heroic mount"],
    allowsTagsMax: 1,
    description:
      "Let you spend GP to recruit a single Heroic Beast or Heroic Mount.",
    cost: 1,
    image: "./gobo.png",
  },
  {
    name: "Elemental Arcanum",
    isUnique: false,
    allowsTags: [],
    description:
      "Unlocks one additional Sacramancy spell per rank, up to the level of the Arcanum to all your proficient Arcanists.",
    options: [
      {
        name: "Elemental Arcanum I",
        allowsTags: ["elemental 1"],
        allowsTagsMax: 1,
        cost: 1,
      },
      {
        name: "Elemental Arcanum II",
        allowsTags: ["elemental 1", "elemental 2"],
        allowsTagsMax: 2,
        cost: 2,
      },
      {
        name: "Elemental Arcanum III",
        allowsTags: ["elemental 1", "elemental 2", "elemental 3"],
        allowsTagsMax: 3,
        cost: 3,
      },
    ],
    cost: 1,
    image: "./gobo.png",
  },
  {
    name: "Druidcraft Arcanum",
    isUnique: false,
    allowsTags: [],
    description:
      "Unlocks one additional Sacramancy spell per rank, up to the level of the Arcanum to all your proficient Arcanists.",
    cost: 1,
    image: "./gobo.png",
    options: [
      {
        name: "Druidcraft Arcanum I",
        allowsTags: ["druidcraft 1"],
        allowsTagsMax: 1,
        cost: 1,
      },
      {
        name: "Druidcraft Arcanum II",
        allowsTags: ["druidcraft 1", "druidcraft 2"],
        allowsTagsMax: 2,
        cost: 2,
      },
      {
        name: "Druidcraft Arcanum III",
        allowsTags: ["druidcraft 1", "druidcraft 2", "druidcraft 3"],
        allowsTagsMax: 3,
        cost: 3,
      },
    ],
  },
  {
    name: "Animancy Arcanum",
    isUnique: false,
    allowsTags: [],
    description:
      "Unlocks one additional Sacramancy spell per rank, up to the level of the Arcanum to all your proficient Arcanists.",
    cost: 1,
    image: "./gobo.png",
    options: [
      {
        name: "Animancy Arcanum I",
        allowsTags: ["animancy 1"],
        allowsTagsMax: 1,
        cost: 1,
      },
      {
        name: "Animancy Arcanum II",
        allowsTags: ["animancy 1", "animancy 2"],
        allowsTagsMax: 2,
        cost: 2,
      },
      {
        name: "Animancy Arcanum III",
        allowsTags: ["animancy 1", "animancy 2", "animancy 3"],
        allowsTagsMax: 3,
        cost: 3,
      },
    ],
  },
  {
    name: "Necromancy Arcanum",
    isUnique: false,
    allowsTags: [],
    description:
      "Unlocks one additional Sacramancy spell per rank, up to the level of the Arcanum to all your proficient Arcanists.",
    cost: 1,
    image: "./gobo.png",
    options: [
      {
        name: "Necromancy Arcanum I",
        allowsTags: ["necromancy 1"],
        allowsTagsMax: 1,
        cost: 1,
      },
      {
        name: "Necromancy Arcanum II",
        allowsTags: ["necromancy 1", "necromancy 2"],
        allowsTagsMax: 2,
        cost: 2,
      },
      {
        name: "Necromancy Arcanum III",
        allowsTags: ["necromancy 1", "necromancy 2", "necromancy 3"],
        allowsTagsMax: 3,
        cost: 3,
      },
    ],
  },
  {
    name: "Sacramancy Arcanum",
    isUnique: false,
    allowsTags: [],
    description:
      "Unlocks one additional Sacramancy spell per rank, up to the level of the Arcanum to all your proficient Arcanists.",
    cost: 1,
    image: "./gobo.png",
    options: [
      {
        name: "Sacramancy Arcanum I",
        allowsTags: ["sacramancy 1"],
        allowsTagsMax: 1,
        cost: 1,
      },
      {
        name: "Sacramancy Arcanum II",
        allowsTags: ["sacramancy 1", "sacramancy 2"],
        allowsTagsMax: 2,
        cost: 2,
      },
      {
        name: "Sacramancy Arcanum III",
        allowsTags: ["sacramancy 1", "sacramancy 2", "sacramancy 3"],
        allowsTagsMax: 3,
        cost: 3,
      },
    ],
  },
  {
    name: "Alchemical Laboratory",
    isUnique: false,
    allowsTags: [],
    description:
      "Unlocks Potions, allowing you to bring a number of them equal to the laboratory's level into a Quest.",
    cost: 1,
    image: "./gobo.png",
    options: [
      {
        name: "Alchemical Laboratory I",
        allowsTags: ["potion 1"],
        allowsTagsMax: 1,
        cost: 1,
      },
      {
        name: "Alchemical Laboratory II",
        allowsTags: ["potion 1", "potion 2"],
        allowsTagsMax: 2,
        cost: 2,
      },
      {
        name: "Alchemical Laboratory III",
        allowsTags: ["potion 1", "potion 2", "potion 3"],
        allowsTagsMax: 3,
        cost: 3,
      },
    ],
  },
  {
    name: "Armory",
    isUnique: true,
    description:
      "Allows you to exchange the Weapon sets of Regular Units between a Quest and another. Check the Campaign Rules for more details.",
    cost: 1,
    isExclusiveToCampaigns: true,
    image: "./gobo.png",
  },
  {
    name: "Training Halls",
    isUnique: true,
    description:
      "Allows you to promote Regular Units to Champions between a Quest and another. Check the Campaign Rules for more details.",
    cost: 1,
    isExclusiveToCampaigns: true,
    image: "./gobo.png",
  },
  {
    name: "Temple",
    isUnique: true,
    description:
      "Let you roll 2 dice instead of 1 for each Casualty Roll. Check the Campaign Rules for more details.",
    cost: 1,
    isExclusiveToCampaigns: true,
    image: "./gobo.png",
  },
  {
    name: "Mercenary Outpost",
    isUnique: true,
    allowsTags: [],
    description:
      "Possessing this GU, if your guild has lower Valor than the other guild, your guild master can hire Mercenaries worth the Valor difference.",
    options: [],
    cost: 1,
    isExclusiveToCampaigns: true,
    image: "./gobo.png",
  },
];

export const BottomSheetWithText: Story = {
  args: {
    defaultValue: ["Guildhall"],
    options: GUs.map((gu) => ({
      label: gu.name,
      value: gu.name,
      base: gu,
    })) as any,
  },
  decorators: [Wrapper],
};
