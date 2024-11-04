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

import { PageContext, usePageContext } from "@/app/contexts/PageContext";
import cn from "classnames";
import { Form, FormProps } from "@/stories/Form";
import Sidebar from "@/stories/Sidebar";
import { Direction, FieldType } from "@/stories/Form/types";

interface DashboardLayoutProps {
  sidebar: string;
  logo: string;
  user: string;
  content: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
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
        {SectionsHash[logo]?.({})}

        {/* User */}
        {SectionsHash[user]?.({})}
      </Flex>

      <Flex height="calc(100vh - 60px)">
        {/* Sidebar */}
        {SectionsHash[sidebar]?.({})}

        {/* Content */}
        {SectionsHash[content]?.({})}
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
  console.log({ selectedChatId });

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

interface Expense {
  id: number;
  name: string;
  amount: number;
  sender: string;
  senderId: string; // uuid
  timestamp: string; // ISO format
}

interface Message {
  id: number;
  sender: string;
  senderId: string; // uuid
  content: string;
  timestamp: string; // ISO format
  isExpense: boolean; // Indicate if the message is an expense
}

interface Payment {
  id: number;
  amount: number;
  user: string;
  timestamp: string; // ISO format
}

const chat1: (Message | Expense | Payment)[] = [
  {
    id: 1,
    sender: "Alejandro",
    senderId: "123e4567-e89b-12d3-a456-426614174000",
    content: "Hola equipo, ¿cuándo nos reunimos para cenar?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 2,
    sender: "Beatriz",
    senderId: "123e4567-e89b-12d3-a456-426614174001",
    content: "¿Qué tal el viernes por la noche?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 3,
    sender: "Carlos",
    senderId: "123e4567-e89b-12d3-a456-426614174002",
    content: "¡Me funciona! ¿Algún lugar en mente?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 4,
    sender: "Alejandro",
    senderId: "123e4567-e89b-12d3-a456-426614174000",
    content: "¡Probemos ese nuevo lugar italiano!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 5,
    sender: "Beatriz",
    senderId: "123e4567-e89b-12d3-a456-426614174001",
    content: "¡Suena genial!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 6,
    name: "Cena en el restaurante de Luigi",
    amount: 120,
    sender: "Alejandro",
    senderId: "123e4567-e89b-12d3-a456-426614174000",
    timestamp: new Date().toISOString(),
  },
  { id: 7, amount: 40, user: "Alejandro", timestamp: new Date().toISOString() },
  { id: 8, amount: 40, user: "Beatriz", timestamp: new Date().toISOString() },
  { id: 9, amount: 40, user: "Carlos", timestamp: new Date().toISOString() },
  {
    id: 10,
    sender: "Carlos",
    senderId: "123e4567-e89b-12d3-a456-426614174002",
    content: "¿Cuándo pagamos?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 11,
    sender: "Beatriz",
    senderId: "123e4567-e89b-12d3-a456-426614174001",
    content: "¿Después de comer, verdad?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 12,
    sender: "Alejandro",
    senderId: "123e4567-e89b-12d3-a456-426614174000",
    content: "¡Exactamente!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 13,
    sender: "Beatriz",
    senderId: "123e4567-e89b-12d3-a456-426614174001",
    content: "¿Podemos dividir la propina también?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 14,
    sender: "Carlos",
    senderId: "123e4567-e89b-12d3-a456-426614174002",
    content: "¡Por supuesto!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 15,
    sender: "Alejandro",
    senderId: "123e4567-e89b-12d3-a456-426614174000",
    content: "¡Está decidido entonces!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 16,
    sender: "Beatriz",
    senderId: "123e4567-e89b-12d3-a456-426614174001",
    content: "¡Estoy emocionada!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 17,
    sender: "Carlos",
    senderId: "123e4567-e89b-12d3-a456-426614174002",
    content: "¡Yo también!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 18,
    sender: "Alejandro",
    senderId: "123e4567-e89b-12d3-a456-426614174000",
    content: "¡Yo haré la reservación!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 19,
    sender: "Beatriz",
    senderId: "123e4567-e89b-12d3-a456-426614174001",
    content: "¡Gracias, Alejandro!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 20,
    sender: "Carlos",
    senderId: "123e4567-e89b-12d3-a456-426614174002",
    content: "¡Eres el mejor!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
];

const chat2: (Message | Expense | Payment)[] = [
  {
    id: 1,
    sender: "Diego",
    senderId: "123e4567-e89b-12d3-a456-426614174003",
    content: "¿Estamos listos para el viaje del fin de semana?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 2,
    sender: "Eva",
    senderId: "123e4567-e89b-12d3-a456-426614174004",
    content: "¡Sí! ¿Quién va a manejar?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 3,
    sender: "Fernando",
    senderId: "123e4567-e89b-12d3-a456-426614174005",
    content: "¡Yo puedo manejar!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 4,
    sender: "Eva",
    senderId: "123e4567-e89b-12d3-a456-426614174004",
    content: "¡Perfecto! Deberíamos comprar gasolina en el camino.",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 5,
    sender: "Diego",
    senderId: "123e4567-e89b-12d3-a456-426614174003",
    content: "¡Suena bien para mí!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 6,
    name: "Gasolina para el viaje",
    amount: 100,
    sender: "Eva",
    senderId: "123e4567-e89b-12d3-a456-426614174004",
    timestamp: new Date().toISOString(),
  },
  { id: 7, amount: 50, user: "Eva", timestamp: new Date().toISOString() },
  { id: 8, amount: 25, user: "Fernando", timestamp: new Date().toISOString() },
  { id: 9, amount: 25, user: "Diego", timestamp: new Date().toISOString() },
  {
    id: 10,
    sender: "Fernando",
    senderId: "123e4567-e89b-12d3-a456-426614174005",
    content: "¿Qué tal la comida? ¿Deberíamos comprar algo en el camino?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 11,
    sender: "Eva",
    senderId: "123e4567-e89b-12d3-a456-426614174004",
    content: "¡Buena idea!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 12,
    sender: "Diego",
    senderId: "123e4567-e89b-12d3-a456-426614174003",
    content: "Solo compremos algunos bocadillos.",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 13,
    sender: "Fernando",
    senderId: "123e4567-e89b-12d3-a456-426614174005",
    content: "¡Yo cubriré los bocadillos!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 14,
    name: "Bocadillos",
    amount: 40,
    sender: "Fernando",
    senderId: "123e4567-e89b-12d3-a456-426614174005",
    timestamp: new Date().toISOString(),
  },
  { id: 15, amount: 40, user: "Fernando", timestamp: new Date().toISOString() },
  {
    id: 16,
    sender: "Diego",
    senderId: "123e4567-e89b-12d3-a456-426614174003",
    content: "¡Eres el mejor, Fernando!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 17,
    sender: "Eva",
    senderId: "123e4567-e89b-12d3-a456-426614174004",
    content: "¿Deberíamos dividir los bocadillos?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 18,
    sender: "Fernando",
    senderId: "123e4567-e89b-12d3-a456-426614174005",
    content: "¡Sí, buena idea!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 19,
    sender: "Diego",
    senderId: "123e4567-e89b-12d3-a456-426614174003",
    content: "¡Vamos a tener un gran viaje!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 20,
    sender: "Eva",
    senderId: "123e4567-e89b-12d3-a456-426614174004",
    content: "¡Sí, estoy emocionada!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
];

const chat3: (Message | Expense | Payment)[] = [
  {
    id: 1,
    sender: "Gabriel",
    senderId: "123e4567-e89b-12d3-a456-426614174006",
    content: "¿Listos para la fiesta de cumpleaños de Ana?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 2,
    sender: "Lucía",
    senderId: "123e4567-e89b-12d3-a456-426614174007",
    content: "¡Sí! ¿Quién traerá el pastel?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 3,
    sender: "Javier",
    senderId: "123e4567-e89b-12d3-a456-426614174008",
    content: "Puedo encargarme del pastel. ¿Qué le gusta a Ana?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 4,
    sender: "Lucía",
    senderId: "123e4567-e89b-12d3-a456-426614174007",
    content: "Le encanta el chocolate.",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 5,
    sender: "Gabriel",
    senderId: "123e4567-e89b-12d3-a456-426614174006",
    content: "Yo puedo traer algunos refrescos.",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 6,
    name: "Pastel de chocolate",
    amount: 50,
    sender: "Javier",
    senderId: "123e4567-e89b-12d3-a456-426614174008",
    timestamp: new Date().toISOString(),
  },
  { id: 7, amount: 25, user: "Javier", timestamp: new Date().toISOString() },
  { id: 8, amount: 15, user: "Gabriel", timestamp: new Date().toISOString() },
  { id: 9, amount: 10, user: "Lucía", timestamp: new Date().toISOString() },
  {
    id: 10,
    sender: "Lucía",
    senderId: "123e4567-e89b-12d3-a456-426614174007",
    content: "¿Deberíamos hacer una lista de regalos también?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 11,
    sender: "Gabriel",
    senderId: "123e4567-e89b-12d3-a456-426614174006",
    content: "Buena idea. ¿Qué le regalaríamos?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 12,
    sender: "Javier",
    senderId: "123e4567-e89b-12d3-a456-426614174008",
    content: "Quizás un libro o algo de ropa.",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 13,
    sender: "Lucía",
    senderId: "123e4567-e89b-12d3-a456-426614174007",
    content: "Ella ama la moda, así que ropa sería genial.",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 14,
    name: "Regalo de ropa",
    amount: 70,
    sender: "Gabriel",
    senderId: "123e4567-e89b-12d3-a456-426614174006",
    timestamp: new Date().toISOString(),
  },
  { id: 15, amount: 30, user: "Lucía", timestamp: new Date().toISOString() },
  { id: 16, amount: 40, user: "Javier", timestamp: new Date().toISOString() },
  {
    id: 17,
    sender: "Gabriel",
    senderId: "123e4567-e89b-12d3-a456-426614174006",
    content: "¿Deberíamos dividir el costo del regalo?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 18,
    sender: "Lucía",
    senderId: "123e4567-e89b-12d3-a456-426614174007",
    content: "¡Sí, sería justo!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 19,
    sender: "Javier",
    senderId: "123e4567-e89b-12d3-a456-426614174008",
    content: "¡No puedo esperar a la fiesta!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 20,
    sender: "Gabriel",
    senderId: "123e4567-e89b-12d3-a456-426614174006",
    content: "¡Yo tampoco!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
];

const chat4: (Message | Expense | Payment)[] = [
  {
    id: 1,
    sender: "Isabella",
    senderId: "123e4567-e89b-12d3-a456-426614174009",
    content: "¿Cuándo empezamos con los planes del viaje?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 2,
    sender: "Mateo",
    senderId: "123e4567-e89b-12d3-a456-426614174010",
    content: "Deberíamos hacerlo pronto. ¿Qué les parece el sábado?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 3,
    sender: "Valentina",
    senderId: "123e4567-e89b-12d3-a456-426614174011",
    content: "Perfecto, el sábado funciona.",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 4,
    sender: "Isabella",
    senderId: "123e4567-e89b-12d3-a456-426614174009",
    content: "¿Deberíamos pensar en el alojamiento?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 5,
    sender: "Mateo",
    senderId: "123e4567-e89b-12d3-a456-426614174010",
    content: "Sí, eso es importante. Busquemos opciones.",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 6,
    name: "Alojamiento en la playa",
    amount: 300,
    sender: "Isabella",
    senderId: "123e4567-e89b-12d3-a456-426614174009",
    timestamp: new Date().toISOString(),
  },
  { id: 7, amount: 100, user: "Isabella", timestamp: new Date().toISOString() },
  { id: 8, amount: 100, user: "Mateo", timestamp: new Date().toISOString() },
  {
    id: 9,
    amount: 100,
    user: "Valentina",
    timestamp: new Date().toISOString(),
  },
  {
    id: 10,
    sender: "Valentina",
    senderId: "123e4567-e89b-12d3-a456-426614174011",
    content: "¿Cuántas noches nos quedaremos?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 11,
    sender: "Isabella",
    senderId: "123e4567-e89b-12d3-a456-426614174009",
    content: "Probablemente tres noches.",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 12,
    sender: "Mateo",
    senderId: "123e4567-e89b-12d3-a456-426614174010",
    content: "¡Suena bien! ¿Qué tal actividades para hacer?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 13,
    sender: "Valentina",
    senderId: "123e4567-e89b-12d3-a456-426614174011",
    content: "Me encantaría hacer senderismo y disfrutar de la playa.",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 14,
    sender: "Isabella",
    senderId: "123e4567-e89b-12d3-a456-426614174009",
    content: "¡Eso suena increíble!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 15,
    name: "Alquiler de equipo de senderismo",
    amount: 50,
    sender: "Mateo",
    senderId: "123e4567-e89b-12d3-a456-426614174010",
    timestamp: new Date().toISOString(),
  },
  { id: 16, amount: 20, user: "Mateo", timestamp: new Date().toISOString() },
  { id: 17, amount: 20, user: "Isabella", timestamp: new Date().toISOString() },
  {
    id: 18,
    amount: 10,
    user: "Valentina",
    timestamp: new Date().toISOString(),
  },
  {
    id: 19,
    sender: "Isabella",
    senderId: "123e4567-e89b-12d3-a456-426614174009",
    content: "Deberíamos dividir los gastos de alojamiento y actividades.",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 20,
    sender: "Mateo",
    senderId: "123e4567-e89b-12d3-a456-426614174010",
    content: "¡Sí, así es más fácil!",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
];

const chats: { [key: string]: (Message | Expense | Payment)[] } = {
  "1": chat1,
  "2": chat2,
  "3": chat3,
  "4": chat4,
};

const messagesAndExpenses: (Message | Expense | Payment)[] = [
  {
    id: 1,
    sender: "Alice",
    senderId: "123e4567-e89b-12d3-a456-426614174000",
    content: "Hey, can we split the bill?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 2,
    sender: "Bob",
    senderId: "123e4567-e89b-12d3-a456-426614174001",
    content: "Sure! How much was it?",
    timestamp: new Date().toISOString(),
    isExpense: false,
  },
  {
    id: 3,
    name: "Dinner",
    amount: 50,
    sender: "Alice",
    senderId: "123e4567-e89b-12d3-a456-426614174000",
    timestamp: new Date().toISOString(),
  },
  {
    id: 4,
    amount: 25,
    user: "Alice",
    timestamp: new Date().toISOString(),
  },
  {
    id: 5,
    amount: 25,
    user: "Bob",
    timestamp: new Date().toISOString(),
  },
];

function ChatHistory() {
  const params = useParams();
  const selectedChatId = params.chatId;

  const currentUserId = "123e4567-e89b-12d3-a456-426614174001";
  const messages = chats[selectedChatId as string] || messagesAndExpenses;

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
      <MessageInput />
    </VStack>
  );
}

function MessageInput() {
  const [message, setMessage] = useState<string>("");
  const { dispatch } = useContext(PageContext);

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
    if (message.trim()) {
      // Handle sending message logic
      console.log("Sending message:", message);
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
};
