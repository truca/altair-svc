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
    sidebar: { type: "LinkSidebar" },
    logo: { type: "Logo" },
    user: { type: "User" },
    content: { type: "Content" },
  },
  modals: [],
  sidebars: [],
};

export default function Home() {
  const state = usePageContextReducer(initialState);

  return (
    <PageContext.Provider value={state}>
      <DashboardLayout {...(state.slots as any)} />
      <ModalsAndSidebars />
    </PageContext.Provider>
  );
}
