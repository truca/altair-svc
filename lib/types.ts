export enum ValueType {
  STRING = "STRING",
  BOOLEAN = "BOOLEAN",
  NUMBER = "NUMBER",
  FILE = "FILE",
  MIXED = "MIXED",
}

export enum FieldType {
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  NUMBER = "NUMBER",
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
  CHECKBOX = "CHECKBOX",
  RADIO = "RADIO",
  SELECT = "SELECT",
  DATE = "DATE",
  TIME = "TIME",
  DATETIME = "DATETIME",
  FILE = "FILE",
  IMAGE = "IMAGE",
  URL = "URL",
  TEL = "TEL",
  COLOR = "COLOR",
  RANGE = "RANGE",
  SEARCH = "SEARCH",
  HIDDEN = "HIDDEN",
  SUBMIT = "SUBMIT",
  RESET = "RESET",
  BUTTON = "BUTTON",
}

export interface FieldValidation {
  label: string;
  value: string;
  valueType: ValueType;
  errorMessage: String;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface Field {
  label: string;
  // In case label doesnt match the field name
  field?: string;
  type: FieldType;
  options?: FieldOption[];
  validation?: FieldValidation[];
}

export type FormTypes = Record<string, string>;
export type Form = Field[];
export type FormsHash = { [key: string]: Form };
