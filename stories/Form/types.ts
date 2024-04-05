import { StackProps } from "@chakra-ui/react";

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
  label: string;
  placeholder?: string;
  initialValue?: string | number | boolean;
  options?: { value: string; label: string }[];
  direction?: Direction;
  isRequired?: boolean;
  sx?: StackProps;
  optionSx?: StackProps;
  inputProps?: any;
}
