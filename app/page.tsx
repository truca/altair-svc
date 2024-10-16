"use client";

import { Layout } from "@/stories/Layout";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from "react";
import {
  Button,
  Modal,
  ModalContent,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import Sidebar from "@/stories/Sidebar";

function Logo() {
  return (
    <Box className="text-white text-lg font-bold">
      <span>My Logo</span>
    </Box>
  );
}

function User() {
  return (
    <Box className="text-white">
      <span>My User</span>
    </Box>
  );
}

function LinkSidebar() {
  return (
    <Box
      as="nav"
      display={{ base: "block", md: "block" }}
      bg="blue.500" /* Same color as header */
      className="w-64 p-4 text-white h-full"
      position={{ base: "fixed", md: "relative" }}
      left={0}
      zIndex={10}
    >
      <Box className="mb-4 font-bold">Sidebar</Box>
      <Box>Link 1</Box>
      <Box>Link 2</Box>
      <Box>Link 3</Box>
    </Box>
  );
}

function Content() {
  const { dispatch } = useContext(PageContext);
  return (
    <Box
      as="main"
      className="flex-1 p-4 bg-gray-100 flex items-center justify-center"
    >
      <Box
        bg="white"
        p={6}
        boxShadow="md"
        rounded="md"
        className="w-full max-w-3xl"
      >
        {/* Content */}
        Altair
        <VStack spacing={3}>
          {/* Show Toast */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              dispatch({
                type: "showToast",
                description: "We've created your account for you.",
                status: "success",
              });
            }}
          >
            Show toast
          </Button>
          {/* Show Sidebar */}
          <Button
            onClick={() =>
              dispatch({
                type: "showSidebar",
                section: "LinkSidebar",
              })
            }
          >
            Show Sidebar
          </Button>
          {/* Show Modal */}
          <Button
            onClick={() =>
              dispatch({
                type: "showModal",
                section: "LinkSidebar",
              })
            }
          >
            Show Modal
          </Button>

          {/* Change Slot */}
          <Button
            onClick={() =>
              dispatch({
                type: "changeSlot",
                slot: "sidebar",
                section: "Content",
              })
            }
          >
            Change Slot
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

const SectionsHash: { [key: string]: () => React.JSX.Element } = {
  Logo,
  User,
  Content,
  LinkSidebar,
};

interface DashboardLayoutProps {
  sidebar: string;
  logo: string;
  user: string;
  content: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  logo,
  user,
  sidebar,
  content,
}) => {
  return (
    <Flex direction="column" className="h-screen w-full">
      {/* Header */}
      <Flex
        as="header"
        alignItems="center"
        justifyContent="space-between"
        bg="blue.500" /* Chakra for color */
        className="p-4 shadow-md"
      >
        {/* Logo */}
        {SectionsHash[logo]?.()}

        {/* User */}
        {SectionsHash[user]?.()}
      </Flex>

      <Flex className="h-full">
        {/* Sidebar */}
        {SectionsHash[sidebar]?.()}

        {/* Content */}
        {SectionsHash[content]?.()}
      </Flex>
    </Flex>
  );
};

interface PageState {
  page: string;
  slots: { [key: string]: string };
  // these are arrays of sections
  modals: string[];
  sidebars: string[];
}

type Action =
  | { type: "setPage"; page: string; slots: { [key: string]: string } }
  | { type: "changeSlot"; slot: string; section: string }
  | { type: "showToast"; description: string; status: string }
  | { type: "showSidebar"; section: string }
  | { type: "hideSidebar"; section: string }
  | { type: "showModal"; section: string }
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
        sidebars: [...(state?.sidebars ?? []), action.section],
      };
    case "hideSidebar":
      return {
        ...state,
        sidebars: state?.sidebars.filter(
          (section) => section !== action.section
        ),
      };
    case "showModal":
      return {
        ...state,
        modals: [...(state?.modals ?? []), action.section],
      };
    case "hideModal":
      return {
        ...state,
        modals: state?.modals.filter((section) => section !== action.section),
      };
    default:
      return state;
  }
}

const initialState: PageState = {
  page: "",
  slots: {
    sidebar: "LinkSidebar",
    logo: "Logo",
    user: "User",
    content: "Content",
  },
  modals: [],
  sidebars: [],
};
const PageContext = createContext<PageState & { dispatch: any }>({
  ...initialState,
  dispatch: () => {},
});
PageContext.displayName = "PageContext";

export default function Home() {
  const showToast = useToast();
  const [state, reduxDispatch] = useReducer(pageReducer, initialState);

  const dispatch = (action: Action) => {
    if (action.type === "showToast") {
      showToast(action as any);
      return;
    }
    reduxDispatch(action);
  };

  return (
    <PageContext.Provider value={{ ...(state as any), dispatch }}>
      <DashboardLayout {...(state.slots as any)} />
      {/* Sidebars */}
      {state.sidebars.map((section: string) => (
        <Sidebar
          key={section}
          isOpen={true}
          onClose={() => dispatch({ type: "hideSidebar", section })}
          title={section}
        >
          {SectionsHash[section]?.()}
        </Sidebar>
      ))}
      {/* Modals */}
      {state.modals.map((section: string) => (
        <Modal
          key={section}
          isOpen
          onClose={() => dispatch({ type: "hideModal", section })}
        >
          <ModalContent>{SectionsHash[section]?.()}</ModalContent>
        </Modal>
      ))}
    </PageContext.Provider>
  );
}
