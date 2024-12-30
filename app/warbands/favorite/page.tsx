"use client";

import { useAuth } from "@/app/contexts/AuthProvider";
import { DashboardLayout, ModalsAndSidebars } from "@/app/components";
import { sidebarCtx, warbandsItemMap } from "@/app/constants";
import {
  PageContext,
  PageState,
  usePageContextReducer,
} from "@/app/contexts/PageContext";
import { gql } from "@apollo/client";
import { useFavoriteWarbands } from "../hooks";

const favoriteWarbandsQuery = gql`
  query FavoriteWarbands($uid: String) {
    me(uid: $uid) {
      id
      favoriteWarbands {
        id
        name
        faction
        guildUpgradePoints
        gloryPoints
      }
    }
  }
`;

const initialWarbandsState = (
  uid: any,
  addWarbandToFavorites: (args: any) => {},
  profileId: string
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
      type: "QueryList",
      ctx: {
        query: favoriteWarbandsQuery,
        type: "horizontal",
        style: {
          width: "calc(100vw - 256px)",
          margin: "20px 0 40px",
          display: "flex",
          gap: 6,
          flexFlow: "wrap",
          padding: 8,
          justifyContent: "center",
          alignItems: "center",
        },
        itemsSelector: "me.favoriteWarbands",
        component: "ItemRenderer",
        variables: { uid },
        itemProps: {
          isCard: true,
          profileId,
        },
        itemMap: warbandsItemMap(addWarbandToFavorites),
      },
    },
  },
  modals: [],
  sidebars: [],
});

interface FavoriteWarbandsProps {
  uid: string;
}

function FavoriteWarbands({ uid }: FavoriteWarbandsProps) {
  const { addWarbandToFavorites, profileId } = useFavoriteWarbands();
  const state = usePageContextReducer(
    initialWarbandsState(uid, addWarbandToFavorites, profileId)
  );

  return (
    <PageContext.Provider key={uid} value={state}>
      <DashboardLayout page={state.page} {...(state.slots as any)} />
      <ModalsAndSidebars />
    </PageContext.Provider>
  );
}

export default function FavoriteWarbandsWrapper() {
  const { profile } = useAuth();

  if (!profile?.uid) return null;
  return <FavoriteWarbands uid={profile?.uid} />;
}
