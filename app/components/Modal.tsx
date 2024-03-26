"use client";

import {
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";

export default function Modal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Tooltip
        label="This will open a modal if you click on it"
        hasArrow
        placement="top"
        p={4}
        borderRadius={4}
      >
        <Button onClick={onOpen}>Open Modal</Button>
      </Tooltip>

      <ChakraModal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontWeight="bold" mb="1rem">
              You can scroll the content behind the modal
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </ChakraModal>
    </>
  );
}
