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

export interface FieldValidation {
  type: ["string" | "number" | "mixed" | "date", string];
  format?: ["email" | "url", string];
  matches?: [string | RegExp, string];
  enum?: [string[], string];
  enum_titles?: [string[], string];
  exclusiveMinimum?: [number, string];

  // Common
  // strict
  // default
  // nullable
  // const?: [string | number, string];
  required?: [boolean, string];
  notRequired?: [boolean, string];
  // oneOf (enum, anyOf)
  // notOneOf
  // refValueFor for confirm password scenario
  // typeError custom type error message (in config)
  // when
  // isType
  nullable?: [boolean, string];

  // Number
  // integer?: []; => use step property instead
  // moreThan (exclusiveMinimum)
  // lessThan (exclusiveMaximum)
  positive?: [string];
  negative?: [string];
  min?: [string, string];
  max?: [string, string];
  // truncate?: [];
  // round?: []; // will force user to input an integer

  // Date
  maxDate?: [Date, string];
  minDate?: [Date, string];

  // String
  minLength?: [number, string];
  maxLength?: [number, string];
  pattern?: [RegExp, string];
  //
  lowercase?: [];
  uppercase?: [];
  trim?: [];
}

export interface Field {
  id: string;
  type: FieldType;
  validation?: FieldValidation;
  label: string;
  hasTitle?: boolean; // specific for radio button
  placeholder?: string;
  defaultValue?: string | number | boolean;
  options?: { value: string; label: string; defaultChecked?: boolean }[];
  direction?: Direction;
  spacing?: number; // radio
  isRequired?: boolean;
  step?: number;
  sx?: StackProps;
  optionSx?: StackProps;
  inputProps?: any;
}

export interface InternalField extends Field {
  register: UseFormRegister<FieldValues>;
  error?: {
    message: string;
  };
}
