import { Field, FieldType, FormsHash, ValueType } from "../lib/types";

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

export const CHAT_FORM: Field[] = [
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

export const FORMS: FormsHash = {
  author: AUTHOR_FORM,
  book: BOOK_FORM,
  chat: CHAT_FORM,
};
