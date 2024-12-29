"use client";

import { DashboardLayout, ModalsAndSidebars } from "../../components";
import {
  PageContext,
  PageState,
  usePageContextReducer,
} from "../../contexts/PageContext";
import { sidebarCtx, smartListCtxWarbands } from "../../constants";
import { gql, useMutation } from "@apollo/client";
import { useAuth } from "@/app/contexts/AuthProvider";

const initialState = (
  addWarbandToFavorites: any,
  profileId: string,
  favoriteWarbandIds: string[]
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
      ctx: smartListCtxWarbands(
        addWarbandToFavorites,
        profileId,
        favoriteWarbandIds
      ),
    },
  },
  modals: [],
  sidebars: [],
});

const addWarbandToFavoritesMutation = gql`
  mutation UpdateMe($id: String!, $favoriteWarbands: [ObjectId]) {
    updateMe(id: $id, profile: { favoriteWarbands: $favoriteWarbands }) {
      id
      favoriteWarbands {
        id
      }
    }
  }
`;

function PublicWarbands() {
  const { profile } = useAuth();
  const { id: profileId, favoriteWarbands } = profile || {};
  const favoriteWarbandIds: string[] = (favoriteWarbands || []).map(
    (warband: { id: string }) => warband.id
  );
  const [addWarbandToFavorites] = useMutation(addWarbandToFavoritesMutation);
  const state = usePageContextReducer(
    initialState(addWarbandToFavorites, profileId, favoriteWarbandIds)
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
