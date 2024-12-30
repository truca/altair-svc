"use client";

import { useAuth } from "@/app/contexts/AuthProvider";
import { DashboardLayout, ModalsAndSidebars } from "../../components";
import {
  PageContext,
  PageState,
  usePageContextReducer,
} from "../../contexts/PageContext";
import { sidebarCtx } from "../../constants";
import { gql } from "@apollo/client";

const meQuery = gql`
  query Me($uid: String) {
    me(uid: $uid) {
      id
      favoriteCards {
        id
        name
        description
        faction
        cost
        image
        frequency
        favoritedCount
      }
    }
  }
`;

const initialState = (
  uid: any
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
        query: meQuery,
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
        itemsSelector: "me.favoriteCards",
        component: "Card",
        variables: { uid },
      },
    },
  },
  modals: [],
  sidebars: [],
});

interface FavoriteCardsProps {
  uid: string;
}

function FavoriteWarbands({ uid }: FavoriteCardsProps) {
  const state = usePageContextReducer(initialState(uid));

  return (
    <PageContext.Provider key={uid} value={state}>
      <DashboardLayout page={state.page} {...(state.slots as any)} />
      <ModalsAndSidebars />
    </PageContext.Provider>
  );
}

export default function FavoriteCardsWrapper() {
  const { profile } = useAuth();

  if (!profile?.uid) return null;
  return <FavoriteWarbands uid={profile?.uid} />;
}
