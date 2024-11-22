"use client";

import { DashboardLayout, ModalsAndSidebars } from "../../components";
import {
  PageContext,
  PageState,
  usePageContextReducer,
} from "../../contexts/PageContext";

const initialState: PageState<"sidebar" | "logo" | "user" | "content"> = {
  page: { type: "" },
  slots: {
    sidebar: { type: "ChatList" },
    logo: { type: "Logo" },
    user: { type: "User" },
    content: { type: "ChatHistory" },
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
