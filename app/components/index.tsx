"use client";

import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Button,
  VStack,
  Box,
  Flex,
  Avatar,
  Text,
  HStack,
  Divider,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalContent,
} from "@chakra-ui/react";
import { FaCheckDouble, FaPlus, FaPaperPlane } from "react-icons/fa";
import { useParams, useRouter } from "next/navigation";

import {
  IPage,
  ISlot,
  PageContext,
  usePageContext,
} from "@/app/contexts/PageContext";
import cn from "classnames";
import { Form, FormProps } from "@/stories/Form";
import Sidebar from "@/stories/Sidebar";
import { Direction, FieldType } from "@/stories/Form/types";
import SmartListWrapper from "@/stories/SmartList";
import { CHATS, MESSAGES_AND_EXPENSES } from "./constants";
import { gql, useMutation } from "@apollo/client";

interface CommonPageProps {
  page: IPage;
}

interface DashboardLayoutProps extends CommonPageProps {
  sidebar: ISlot;
  logo: ISlot;
  user: ISlot;
  content: ISlot;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  page,
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
        {SectionsHash[logo.type]?.({ ...page.ctx, ...logo.ctx })}

        {/* User */}
        {SectionsHash[user.type]?.({ ...page.ctx, ...user.ctx })}
      </Flex>

      <Flex height="calc(100vh - 60px)">
        {/* Sidebar */}
        {SectionsHash[sidebar.type]?.({ ...page.ctx, ...sidebar.ctx })}

        {/* Content */}
        {SectionsHash[content.type]?.({ ...page.ctx, ...content.ctx })}
      </Flex>
    </Flex>
  );
};

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
      bg="blue.500" /* Same color as header */
      className="w-64 p-4 text-white h-full flex flex-col gap-1"
      position={{ base: "fixed", md: "relative" }}
      left={0}
      zIndex={10}
    >
      <Box className="mb-4 font-bold">Sidebar</Box>
      <Box className="cursor-pointer">Link 1</Box>
      <Box className="cursor-pointer">Link 2</Box>
      <Box className="cursor-pointer">Link 3</Box>
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

          {/* Change Slot to Sidebar */}
          <Button
            onClick={() =>
              dispatch({
                type: "changeSlot",
                slot: "sidebar",
                section: "LinkSidebar",
              })
            }
          >
            Change Slot Sidebar
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}

type Chat = {
  id: string;
  name: string;
  message: string;
  time: string;
  avatarUrl?: string;
  isRead: boolean;
};

const chatList: Chat[] = [
  {
    id: "1",
    name: "Planes de Cena",
    message: "¡Hola!",
    time: "09:45 AM",
    isRead: true,
  },
  {
    id: "2",
    name: "Planificación de Viaje de Fin de Semana",
    message: "Pongámonos al día pronto.",
    time: "08:15 AM",
    isRead: false,
  },
  {
    id: "3",
    name: "Noche de Juegos",
    message: "Entendido, ¡gracias!",
    time: "Ayer",
    isRead: true,
  },
  {
    id: "4",
    name: "Planificación de Vacaciones",
    message: "Mira esto.",
    time: "Ayer",
    isRead: false,
  },
];

function ChatList() {
  const router = useRouter();
  const params = useParams();
  const selectedChatId = params.chatId;

  const handleChatClick = (id: string) => {
    router.push(`/chats/${id}`); // Update URL with selected chat ID
  };

  return (
    <VStack
      spacing={0}
      className="w-full max-w-md mx-auto bg-white shadow-md overflow-hidden"
    >
      {chatList.map((chat, index) => (
        <React.Fragment key={chat.id}>
          <Box
            onClick={() => handleChatClick(chat.id)}
            className="w-full cursor-pointer"
            _hover={{ bg: "gray.100" }}
            bg={selectedChatId === chat.id ? "blue.50" : "white"}
            p={4}
          >
            <HStack spacing={4} className="flex w-full items-center">
              <Avatar name={chat.name} src={chat.avatarUrl} size="md" />
              <Box flex="1" className="flex flex-col space-y-1">
                <HStack justify="space-between">
                  <Text
                    fontSize="md"
                    fontWeight="bold"
                    color={selectedChatId === chat.id ? "blue.600" : "black"}
                  >
                    {chat.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {chat.time}
                  </Text>
                </HStack>
                <HStack>
                  {chat.isRead && <FaCheckDouble color="green" />}
                  <Text
                    fontSize="sm"
                    color={selectedChatId === chat.id ? "blue.600" : "gray.600"}
                    noOfLines={1}
                  >
                    {chat.message}
                  </Text>
                </HStack>
              </Box>
            </HStack>
          </Box>
          {index < chatList.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </VStack>
  );
}

function ChatHistory() {
  const params = useParams();
  const selectedChatId = params.chatId as string;

  const currentUserId = "123e4567-e89b-12d3-a456-426614174001";
  const messages = CHATS[selectedChatId] || MESSAGES_AND_EXPENSES;

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      // Scroll to the bottom of the chat container
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [selectedChatId]);

  return (
    <VStack className="w-full !gap-0 bg-white shadow-md">
      {/* Messages, Expenses, and Payments Display */}
      <VStack
        ref={chatContainerRef}
        spacing={2}
        className="w-full p-4 overflow-y-scroll"
        align="stretch"
      >
        {messages.map((item) => {
          if ("content" in item) {
            // It's a Message
            return (
              <Box
                key={item.id}
                bg="gray.100"
                p={3}
                borderRadius="md"
                boxShadow="sm"
                className={cn("max-w-xl", "min-w-80", {
                  ["self-end"]: item.senderId === currentUserId,
                })}
              >
                <HStack spacing={3}>
                  <Avatar name={item.sender} size="sm" />
                  <VStack align="start">
                    <Text fontWeight="bold">{item.sender}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(item.timestamp).toLocaleString()}
                    </Text>
                    <Text>{item.content}</Text>
                  </VStack>
                </HStack>
              </Box>
            );
          } else if ("name" in item) {
            // It's an Expense
            return (
              <Box
                key={item.id}
                p={4}
                borderWidth={1}
                borderRadius="md"
                borderColor="gray.200"
                bg="yellow.50"
                className="max-w-xl"
              >
                <HStack justify="space-between">
                  <Text fontWeight="bold">{item.name}</Text>
                  <Text color="green.500">${item.amount.toFixed(2)}</Text>
                </HStack>
                <Text color="gray.500">
                  Created by: {item.sender} on{" "}
                  {new Date(item.timestamp).toLocaleDateString()}
                </Text>
                <Button mt={2} colorScheme="teal" size="sm">
                  View Details
                </Button>
              </Box>
            );
          } else {
            // It's a Payment Event
            return (
              <Box
                key={item.id}
                p={1}
                borderRadius="md"
                bg="gray.200" // Light gray background
                mb={1}
                width="fit-content" // Restrict width to content
                mx="auto" // Center the box
              >
                <Text fontSize="xs" textAlign="center" color="gray.600">
                  {item.user} paid ${item.amount.toFixed(2)} on{" "}
                  {new Date(item.timestamp).toLocaleDateString()}
                </Text>
              </Box>
            );
          }
        })}
      </VStack>
      <MessageInput chatId={selectedChatId} />
    </VStack>
  );
}

const createMessageMutation = gql`
  mutation createMessage($text: String, $chatId: ID) {
    createMessage(data: { text: $text, chat: { id: $chatId } }) {
      id
      text
      chat {
        id
        name
      }
    }
  }
`;

interface MessageInputProps {
  chatId: string;
}

function MessageInput({ chatId }: MessageInputProps) {
  const [message, setMessage] = useState<string>("");
  const { dispatch } = useContext(PageContext);
  const [sendMessage] = useMutation(createMessageMutation);

  const handleSelect = (type: "expense" | "payment") => {
    const formProps: FormProps = {
      direction: Direction.COLUMN,
      fields: [
        {
          id: "name",
          type: FieldType.TEXT,
          label: "Name",
          placeholder: "Enter name",
        },
        {
          id: "amount",
          type: FieldType.NUMBER,
          label: "Amount",
          placeholder: "Enter amount",
        },
      ],
      onSubmit: (values) => console.log({ values }),
    };
    dispatch({
      type: "showSidebar",
      section: "Form",
      ctx: formProps,
    });
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      sendMessage({ variables: { text: trimmedMessage, chatId } });
      setMessage("");
    }
  };

  return (
    <Box className="flex w-full items-center space-x-2 p-2 bg-white rounded shadow">
      <Menu>
        <MenuButton as={IconButton} icon={<FaPlus />} aria-label="Add" />
        <MenuList>
          <MenuItem onClick={() => handleSelect("expense")}>
            Add Expense
          </MenuItem>
          <MenuItem onClick={() => handleSelect("payment")}>
            Add Payment
          </MenuItem>
        </MenuList>
      </Menu>
      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1"
      />
      <IconButton
        icon={<FaPaperPlane />}
        aria-label="Send message"
        onClick={handleSendMessage}
      />
    </Box>
  );
}

export function ModalsAndSidebars() {
  const state = usePageContext();
  return (
    <>
      {/* Sidebars */}
      {state.sidebars.map((section) => (
        <Sidebar
          key={section.type}
          isOpen={true}
          onClose={() =>
            state.dispatch({ type: "hideSidebar", section: section.type })
          }
          title={section.type}
        >
          {SectionsHash[section.type]?.(section.ctx)}
        </Sidebar>
      ))}
      {/* Modals */}
      {state.modals.map((section) => (
        <Modal
          key={section.type}
          isOpen
          onClose={() =>
            state.dispatch({ type: "hideModal", section: section.type })
          }
        >
          <ModalContent>
            {SectionsHash[section.type]?.(section.ctx)}
          </ModalContent>
        </Modal>
      ))}
    </>
  );
}

export const SectionsHash: {
  [key: string]: (props: any) => React.JSX.Element;
} = {
  Logo,
  User,
  Content,
  LinkSidebar,
  ChatList,
  ChatHistory,
  Form,
  SmartList: SmartListWrapper,
};
