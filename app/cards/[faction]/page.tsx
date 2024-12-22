"use client";

import { useParams } from "next/navigation";
import { DashboardLayout, ModalsAndSidebars } from "../../components";
import {
  PageContext,
  PageState,
  usePageContextReducer,
} from "../../contexts/PageContext";
import { sidebarCtx, smartListCtx } from "../../constants";

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
      type: "SmartList",
      ctx: {
        where: { faction },
        ...smartListCtx,
      },
    },
  },
  modals: [],
  sidebars: [],
});

export default function Chats() {
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
