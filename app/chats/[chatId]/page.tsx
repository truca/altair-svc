"use client";

import { DashboardLayout, ModalsAndSidebars } from "@/app/components";
import {
  PageContext,
  PageState,
  usePageContextReducer,
} from "@/app/contexts/PageContext";

const initialState: PageState = {
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
      <DashboardLayout {...(state.slots as any)} />
      <ModalsAndSidebars />
    </PageContext.Provider>
  );
}
