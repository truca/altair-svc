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
import { Form, FormProps } from "../Form";
import BottomSheet, { BottomSheetProps } from "../BottomSheet";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  btnRef?: React.RefObject<HTMLButtonElement>;
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
  btnRef,
  children,
  title,
  footer,
  footerButtons,
}: DrawerProps) {
  return (
    <BaseDrawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
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

interface SideFormProps {
  form?: FormProps;
  children?: React.ReactNode;
  type?: "drawer" | "bottomSheet";
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

// source
// https://codesandbox.io/p/sandbox/bottomsheet-modal-example-l3z7q?file=%2Fsrc%2FBottomSheet.js%3A11%2C17
function SideForm(props: SideFormProps) {
  const { isOpen, onClose, type, title, form, children } = props;
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  if (!form && !children) return null;

  if (type === "bottomSheet") {
    return (
      <BottomSheet title={title} isOpen={isOpen} onClose={onClose}>
        {children ?? <Form {...(props.form as FormProps)} />}
      </BottomSheet>
    );
  }

  return (
    <Drawer title={title} isOpen={isOpen} onClose={onClose} btnRef={btnRef}>
      {children ?? <Form {...(props.form as FormProps)} />}
    </Drawer>
  );
}

export default SideForm;
