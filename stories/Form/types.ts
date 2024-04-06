import { StackProps } from "@chakra-ui/react";
import { FieldValues, UseFormRegister } from "react-hook-form";

export enum FieldType {
  TEXT = "text",
  NUMBER = "number",
  EMAIL = "email",
  TELEPHONE = "tel",
  PASSWORD = "password",
  TEXTAREA = "textarea",
  SELECT = "select",
  CHECKBOX = "checkbox",
  RADIO = "radio",

  FILE = "file",

  HIDDEN = "hidden",
  RESET = "reset",

  DATE = "date",
  DATETIME_LOCAL = "datetime-local",
  MONTH = "month",
  WEEK = "week",
  TIME = "time",

  URL = "url",
  SEARCH = "search",

  COLOR = "color",

  SUBMIT = "submit",
}

export enum Direction {
  ROW = "row",
  COLUMN = "column",
}

export interface Field {
  id: string;
  type: FieldType;
  // first element on the array is the type, second is the error message
  validation?: {
    // title?: string;
    // description?: string;
    // propertyOrder?: number;
    type: ["string" | "number", string];
    required?: [boolean, string];
    format?: ["email", string];
    matches?: [string, string];
    enum?: [string[], string];
    enum_titles?: [string[], string];
    exclusiveMinimum?: [number, string];
  };
  label: string;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  options?: { value: string; label: string }[];
  direction?: Direction;
  isRequired?: boolean;
  sx?: StackProps;
  optionSx?: StackProps;
  inputProps?: any;
}

export interface FieldWithValidation extends Field {
  validation: {
    type: ["string" | "number", string];
    required?: [boolean, string];
    format?: ["email", string];
    matches?: [string, string];
    enum?: [string[], string];
    enum_titles?: [string[], string];
    exclusiveMinimum?: [number, string];
  };
}

export interface InternalField extends Field {
  register: UseFormRegister<FieldValues>;
  error?: {
    message: string;
  };
}
