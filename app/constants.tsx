export const noop = () => {};

import { Button, HStack } from "@chakra-ui/react";
import { SmartFormWrapperProps } from "./stories/SmartForm";
import { FaIcon } from "./stories/Text/FaIcon";
import cn from "classnames";
import { useAuth } from "./contexts/AuthProvider";

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

export const warbandsItemMap =
  (addWarbandToFavorites: (args: any) => {}) => (option: any) => ({
    item: { ...option },
    // open sidebar through dispatch
    onClick: () => {},
    containerSx: {
      cursor: "pointer",
    },
    ChildComponent: (props: any) => {
      const {
        item: { id },
        profileId,
      } = props;
      const { profile } = useAuth();
      const { favoriteWarbands: favoriteWarbandsBase } = profile || {};
      const favoriteWarbands =
        favoriteWarbandsBase?.map((w: { id: string }) => ({ id: w.id })) || [];
      const favoriteWarbandIds: string[] = (favoriteWarbands || []).map(
        (warband: { id: string }) => warband.id
      );
      const isFavorited = favoriteWarbandIds.includes(id);

      return (
        <HStack
          style={{ width: "100%", marginTop: 15, justifyContent: "center" }}
        >
          <Button
            rounded="full"
            variant="solid"
            colorScheme={isFavorited ? "red" : "gray"}
            padding={0}
            className={cn(
              { "!bg-red-400 hover:!bg-red-300": isFavorited },
              "!bg-red-300 hover:!bg-red-400 !text-white"
            )}
            onClick={(e) => {
              e.stopPropagation();
              addWarbandToFavorites({
                variables: {
                  id: profileId,
                  favoriteWarbands: isFavorited
                    ? favoriteWarbands?.filter(
                        (card: { id: string }) => card.id !== id
                      )
                    : [...favoriteWarbands, { id }],
                },
              });
            }}
          >
            <FaIcon icon="FaHeart" />
          </Button>
        </HStack>
      );
    },
  });

export const smartListCtxWarbands = (
  addWarbandToFavorites: (args: any) => {},
  profileId: string
) => ({
  entityType: "warband",
  fieldNames: ["id", "faction", "name", "guildUpgradePoints", "gloryPoints"],
  initialPageSize: 50,
  controls: ["page", "pageSize"],
  itemComponent: "ItemRenderer",
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
  itemProps: {
    isCard: true,
    profileId,
  },
  itemMap: warbandsItemMap(addWarbandToFavorites),
});

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
