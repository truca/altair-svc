import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
} from "@chakra-ui/react";

export interface BottomSheetProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  shouldCloseOnClickOutside?: boolean;
}

// source
// https://codesandbox.io/p/sandbox/bottomsheet-modal-example-l3z7q?file=%2Fsrc%2FBottomSheet.js%3A11%2C17
function BottomSheet({
  title,
  children,
  isOpen,
  onClose,
  shouldCloseOnClickOutside = true,
}: BottomSheetProps) {
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      scrollBehavior="outside"
      motionPreset="slideInBottom"
      // trapFocus={false}
    >
      <ModalOverlay onClick={shouldCloseOnClickOutside ? onClose : undefined} />
      <ModalContent
        position="fixed"
        bottom="0px"
        mb="0"
        borderRadius="1.75rem 1.75rem 0px 0px"
        maxW="lg"
      >
        {title && (
          <ModalHeader textAlign="center" fontSize="3xl">
            {title}
          </ModalHeader>
        )}
        <ModalCloseButton outline="none" _focus={{ outline: "none" }} />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default BottomSheet;
