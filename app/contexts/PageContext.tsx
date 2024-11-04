"use client";

import { useReducer, createContext, useContext } from "react";
import { useToast } from "@chakra-ui/react";

export interface ISidebar {
  type: string;
  ctx: any;
}

export interface IModal {
  type: string;
  ctx: any;
}

export interface PageState {
  page: string;
  slots: { [key: string]: string };
  // these are arrays of sections
  modals: IModal[];
  sidebars: ISidebar[];
}

type Action =
  | { type: "setPage"; page: string; slots: { [key: string]: string } }
  | { type: "changeSlot"; slot: string; section: string }
  | { type: "showToast"; description: string; status: string }
  | { type: "showSidebar"; section: string; ctx?: any }
  | { type: "hideSidebar"; section: string }
  | { type: "showModal"; section: string; ctx?: any }
  | { type: "hideModal"; section: string };

function pageReducer(state: PageState, action: Action): PageState {
  console.log({ state, action });
  switch (action.type) {
    case "setPage":
      return {
        page: action.page,
        slots: action.slots,
        modals: [],
        sidebars: [],
      };
    case "changeSlot":
      const { slot, section } = action;
      return {
        ...state,
        slots: {
          ...state?.slots,
          [slot]: section,
        },
      };
    case "showSidebar":
      return {
        ...state,
        sidebars: [
          ...(state?.sidebars ?? []),
          { type: action.section, ctx: action.ctx },
        ],
      };
    case "hideSidebar":
      return {
        ...state,
        sidebars: state?.sidebars.filter(
          (section) => section.type !== action.section
        ),
      };
    case "showModal":
      return {
        ...state,
        modals: [
          ...(state?.modals ?? []),
          { type: action.section, ctx: action.ctx },
        ],
      };
    case "hideModal":
      return {
        ...state,
        modals: state?.modals.filter(
          (section) => section.type !== action.section
        ),
      };
    default:
      return state;
  }
}

const initialState: PageState = {
  page: "",
  slots: {
    sidebar: "ChatList",
    logo: "Logo",
    user: "User",
    content: "Content",
  },
  modals: [],
  sidebars: [],
};

export function usePageContextReducer(
  init: PageState
): PageState & { dispatch: any } {
  const showToast = useToast();
  const [state, reduxDispatch] = useReducer(pageReducer, init);

  const dispatch = (action: Action) => {
    if (action.type === "showToast") {
      showToast(action as any);
      return;
    }
    reduxDispatch(action);
  };
  return { ...(state as any), dispatch };
}

export const PageContext = createContext<PageState & { dispatch: any }>({
  ...initialState,
  dispatch: () => {},
});

export function usePageContext() {
  return useContext(PageContext);
}

PageContext.displayName = "PageContext";
