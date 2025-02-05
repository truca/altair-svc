"use client";

import { useReducer, createContext, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

export interface ISidebar {
  type: string;
  ctx: any;
}

export interface IModal {
  type: string;
  ctx: any;
}

export interface IPage {
  type: string;
  ctx?: any;
}

export interface ISlot {
  type: string;
  ctx?: any;
}

export interface PageState<SlotsKeys extends string> {
  page: IPage;
  slots: { [key in SlotsKeys]: ISlot };
  // these are arrays of sections
  modals: IModal[];
  sidebars: ISidebar[];
}

type Action =
  | { type: "redirect"; path: string }
  | { type: "setPage"; page: IPage; slots: { [key: string]: ISlot } }
  | { type: "changeSlot"; slot: string; section: ISlot }
  | { type: "showToast"; description: string; status: string }
  | { type: "showSidebar"; section: string; ctx?: any }
  | { type: "hideSidebar"; section: string }
  | { type: "showModal"; section: string; ctx?: any }
  | { type: "hideModal"; section: string };

function pageReducer<SlotsKeys extends string>(
  state: PageState<SlotsKeys>,
  action: Action
): PageState<SlotsKeys> {
  console.log({ state, action });
  switch (action.type) {
    case "setPage":
      return {
        page: { ...state.page, ...action.page },
        slots: { ...state.slots, ...action.slots },
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

const initialState: PageState<"sidebar" | "logo" | "user" | "content"> = {
  page: { type: "" },
  slots: {
    sidebar: { type: "ChatList" },
    logo: { type: "Logo" },
    user: { type: "User" },
    content: { type: "Content" },
  },
  modals: [],
  sidebars: [],
};

export function usePageContextReducer<SlotsKeys extends string>(
  init: PageState<SlotsKeys>
): PageState<SlotsKeys> & { dispatch: any } {
  //   const router = useRouter();
  const showToast = useToast();
  const [state, reduxDispatch] = useReducer(pageReducer, init);
  console.log("init: ", init);

  const dispatch = (action: Action) => {
    if (action.type === "showToast") {
      showToast(action as any);
      return;
    }
    if (action.type === "redirect") {
      //   router.push(action.path);
      return;
    }
    reduxDispatch(action);
  };
  return { ...(state as any), dispatch };
}

export const PageContext = createContext<PageState<string> & { dispatch: any }>(
  {
    ...initialState,
    dispatch: () => {},
  }
);

export function usePageContext() {
  return useContext(PageContext);
}

PageContext.displayName = "PageContext";
