import React from "react";
import {
  Button,
  Drawer as BaseDrawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import BottomSheet from "../BottomSheet";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  footerButtons?: {
    submit: string;
    onSubmit: () => void;
    cancel?: string;
    onCancel?: () => void;
  };
}

function Drawer({
  isOpen,
  onClose,
  children,
  title,
  footer,
  footerButtons,
}: DrawerProps) {
  return (
    <BaseDrawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay onClick={onClose} />
      <DrawerContent>
        <DrawerCloseButton />
        {title && <DrawerHeader>{title}</DrawerHeader>}

        <DrawerBody>{children}</DrawerBody>

        {footerButtons ? (
          <DrawerFooter>
            {footerButtons.cancel && (
              <Button
                variant="outline"
                mr={3}
                onClick={footerButtons.onCancel ?? onClose}
              >
                {footerButtons.cancel}
              </Button>
            )}
            {footerButtons.submit && (
              <Button colorScheme="blue" onClick={footerButtons.onSubmit}>
                {footerButtons.submit}
              </Button>
            )}
          </DrawerFooter>
        ) : (
          footer
        )}
      </DrawerContent>
    </BaseDrawer>
  );
}

interface SidebarProps {
  children?: React.ReactNode;
  type?: "drawer" | "bottomSheet";
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

// source
// https://codesandbox.io/p/sandbox/bottomsheet-modal-example-l3z7q?file=%2Fsrc%2FBottomSheet.js%3A11%2C17
function Sidebar(props: SidebarProps) {
  const { isOpen, onClose, type, title, children } = props;

  if (type === "bottomSheet") {
    return (
      <BottomSheet title={title} isOpen={isOpen} onClose={onClose}>
        {children}
      </BottomSheet>
    );
  }

  return (
    <Drawer title={title} isOpen={isOpen} onClose={onClose}>
      {children}
    </Drawer>
  );
}

export default Sidebar;
