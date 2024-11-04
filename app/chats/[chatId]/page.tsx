"use client";

import { DashboardLayout, ModalsAndSidebars } from "@/app/components";
import {
  PageContext,
  PageState,
  usePageContextReducer,
} from "@/app/contexts/PageContext";

const initialState: PageState = {
  page: "",
  slots: {
    sidebar: "ChatList",
    logo: "Logo",
    user: "User",
    content: "ChatHistory",
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
