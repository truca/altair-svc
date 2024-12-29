export const noop = () => {};

import { SmartFormWrapperProps } from "./stories/SmartForm";

export const baseUrl = process.env.SERVICE
  ? process.env.SERVICE
  : "http://localhost:4000";

export const smartListCtx: any = {
  entityType: "card",
  fieldNames: ["id", "faction", "image"],
  initialPageSize: 50,
  controls: ["page", "pageSize"],
  itemComponent: "Card",
  containerSx: {
    gap: 8,
    alignContent: "center",
    margin: "20px 0 40px",
  },
  listContainerSx: {
    display: "flex",
    gap: 6,
    flexDirection: "row",
    padding: 8,
    justifyContent: "center",
    flexWrap: "wrap",
    margin: "0 auto",
    alignItems: "center",
  },
  bottomControlSx: {
    alignSelf: "center",
  },
  itemMap: (option: any) => ({
    ...option,
    image: baseUrl + "/" + option.image,
  }),
};

export const smartListCtxWarbands = {
  entityType: "warband",
  fieldNames: ["id", "faction", "name", "guildUpgradePoints", "gloryPoints"],
  initialPageSize: 50,
  controls: ["page", "pageSize"],
  itemComponent: "ItemRenderer",
  itemProps: {
    isCard: true,
  },
  containerSx: {
    gap: 8,
    alignContent: "center",
    margin: "20px 0 40px",
  },
  listContainerSx: {
    display: "flex",
    gap: 6,
    flexDirection: "row",
    padding: 8,
    justifyContent: "center",
    flexWrap: "wrap",
    margin: "0 auto",
    alignItems: "center",
  },
  bottomControlSx: {
    alignSelf: "center",
  },
  itemMap: (option: any) => ({
    item: { ...option },
  }),
};

export const sidebarCtx = {
  sections: [
    {
      name: "Cards",
      link: "/cards",
      subsections: [
        { name: "All", link: "/cards" },
        { name: "Favorites", link: "/cards/favorite" },

        { name: "Chaos", link: "/cards/chaos" },
        { name: "Corruption", link: "/cards/corruption" },
        { name: "Fortitude", link: "/cards/fortitude" },
        { name: "Order", link: "/cards/order" },
        { name: "Wild", link: "/cards/wild" },

        { name: "Spells", link: "/cards/spells" },
        { name: "Monster", link: "/cards/monster" },
      ],
    },
    {
      name: "Warbands",
      subsections: [
        { name: "Create", link: "/warbands/create" },
        { name: "Favorites", link: "/warbands/favorite" },
        { name: "Personal", link: "/warbands/personal" },
        { name: "Public", link: "/warbands/public" },
      ],
    },
    {
      name: "Tournaments",
      subsections: [
        { name: "All", link: "/tournaments/favorite" },
        { name: "Personal", link: "/tournaments/personal" },
        { name: "Public", link: "/tournaments/public" },
      ],
    },
    {
      name: "Collection",
      link: "/collection",
    },
    {
      name: "User Content",
      link: "/user-content",
    },
  ],
};
