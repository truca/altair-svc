enum ValueType {
  STRING = "STRING",
  BOOLEAN = "BOOLEAN",
  NUMBER = "NUMBER",
  FILE = "FILE",
  MIXED = "MIXED",
}

enum FieldType {
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

interface FieldValidation {
  label: string;
  value: string;
  valueType: ValueType;
  errorMessage: String;
}

interface Field {
  label: string;
  type: FieldType;
  validation?: FieldValidation[];
}

export const AUTHOR_FORM: Field[] = [
  {
    label: "name",
    type: FieldType.TEXT,
    validation: [
      {
        label: "type",
        value: "string",
        valueType: ValueType.STRING,
        errorMessage: "Name should be a string",
      },
      {
        label: "required",
        value: "true",
        valueType: ValueType.BOOLEAN,
        errorMessage: "Name is required",
      },
    ],
  },
];

export const BOOK_FORM: Field[] = [
  {
    label: "name",
    type: FieldType.TEXT,
    validation: [
      {
        label: "type",
        value: "string",
        valueType: ValueType.STRING,
        errorMessage: "Name should be a string",
      },
      {
        label: "required",
        value: "true",
        valueType: ValueType.BOOLEAN,
        errorMessage: "Name is required",
      },
    ],
  },
  {
    label: "avatar",
    type: FieldType.FILE,
  },
];

export const FORMS: { [key: string]: Field[] } = {
  author: AUTHOR_FORM,
  book: BOOK_FORM,
};
