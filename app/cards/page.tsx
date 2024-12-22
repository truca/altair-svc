"use client";

import { DashboardLayout, ModalsAndSidebars } from "../components";
import {
  PageContext,
  PageState,
  usePageContextReducer,
} from "../contexts/PageContext";
import { sidebarCtx, smartListCtx } from "../constants";

const initialState: PageState<"sidebar" | "logo" | "user" | "content"> = {
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
      ctx: smartListCtx,
    },
  },
  modals: [],
  sidebars: [],
};

export default function Chats() {
  const state = usePageContextReducer(initialState);

  return (
    <PageContext.Provider value={state}>
      <DashboardLayout page={state.page} {...(state.slots as any)} />
      <ModalsAndSidebars />
    </PageContext.Provider>
  );
}
