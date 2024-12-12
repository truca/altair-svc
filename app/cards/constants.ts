import { ControlType } from "../stories/SmartList";

export const smartListCtx = {
  entityType: "card",
  fieldNames: ["id", "faction", "image"],
  initialPageSize: 50,
  controls: [ControlType.Page, ControlType.PageSize],
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
