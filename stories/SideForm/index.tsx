import React from "react";
import { Form, FormProps } from "../Form";
import Sidebar from "../Sidebar";

interface SideFormProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "drawer" | "bottomSheet";
  title?: string;
  form?: FormProps;
  children?: React.ReactNode;
}

function SideForm(props: SideFormProps) {
  const { isOpen, onClose, type, title, form, children } = props;
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  if (!form && !children) return null;

  return (
    <Sidebar {...{ isOpen, onClose, type, title, children, btnRef }}>
      {children ?? <Form {...(props.form as FormProps)} />}
    </Sidebar>
  );
}

export default SideForm;
