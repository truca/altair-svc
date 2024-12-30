"use client";

import { DashboardLayout, ModalsAndSidebars } from "../../components";
import { PageContext, usePageContextReducer } from "../../contexts/PageContext";
import { useAuth } from "@/app/contexts/AuthProvider";
import { useFavoriteWarbands } from "../hooks";
import { PageState } from "../../contexts/PageContext";
import { sidebarCtx, smartListCtxWarbands } from "../../constants";

const initialStateForPublicWarbands = (
  addWarbandToFavorites: any,
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
      type: "SmartList",
      ctx: smartListCtxWarbands(addWarbandToFavorites, profileId),
    },
  },
  modals: [],
  sidebars: [],
});

function PublicWarbands() {
  const { addWarbandToFavorites, profileId } = useFavoriteWarbands();

  const state = usePageContextReducer(
    initialStateForPublicWarbands(addWarbandToFavorites, profileId)
  );

  return (
    <PageContext.Provider value={state}>
      <DashboardLayout page={state.page} {...(state.slots as any)} />
      <ModalsAndSidebars />
    </PageContext.Provider>
  );
}

export default function PublicWarbandsPage() {
  const { profile } = useAuth();
  if (!profile) return null;

  return <PublicWarbands />;
}
