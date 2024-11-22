import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ChakraProvider,
  InputProps,
  ThemeProvider,
  theme,
} from "@chakra-ui/react";
import { Form } from "./index";
import { Direction, FieldType } from "./types";

const meta: Meta<typeof Form> = {
  component: Form,
  title: "molecules/Form",
};
export default meta;
type Story = StoryObj<typeof Form>;

const Wrapper = (Story: any) => (
  <ChakraProvider>
    <Story />
  </ChakraProvider>
);

export const SimpleDebugForm: Story = {
  args: {
    debug: true,
    direction: Direction.COLUMN,
    commonFieldProps: {
      inputProps: { colorScheme: "red" } as any,
    },
    onSubmit: (data) => {
      alert(`Values: ${JSON.stringify(data)}`);
    },
    fields: [
      {
        id: "radio",
        label: "Radio",
        type: FieldType.RADIO,
        hasTitle: true,
        direction: Direction.ROW,
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
          { value: "3", label: "Option 3" },
        ],
      },
      {
        id: "file",
        label: "File",
        type: FieldType.FILE,
      },
      // {
      //   id: "username",
      //   label: "Username",
      //   type: FieldType.TEXT,
      //   defaultValue: "test@com",
      //   validation: {
      //     type: ["string", "should be a string"],
      //     required: [true, "this is required"],
      //     format: ["email", "should be an email"],
      //     trim: [],
      //     uppercase: [],
      //   },
      // },
      // {
      //   id: "matches",
      //   label: "Matches",
      //   type: FieldType.TEXT,
      //   validation: {
      //     type: ["string", "should be a string"],
      //     matches: [/^[a-zA-Z]+$/, "should be only letters"],
      //     minLength: [3, "should be at least 3 characters"],
      //   },
      // },
      // {
      //   id: "not required",
      //   label: "Not Required",
      //   type: FieldType.TEXT,
      //   validation: {
      //     type: ["string", "should be a string"],
      //     notRequired: [true, "this is not required"],
      //   },
      // },
      // {
      //   id: "enum",
      //   label: "Enum",
      //   type: FieldType.TEXT,
      //   validation: {
      //     type: ["string", "should be a string"],
      //     enum: [["perro", "gato"], "should be perro or gato"],
      //   },
      // },
      // {
      //   id: "minGrade",
      //   label: "Min Grade",
      //   type: FieldType.NUMBER,
      //   validation: {
      //     type: ["number", "should be a number"],
      //     required: [true, "this is required"],
      //     negative: ["should be negative"],
      //   },
      // },
      // {
      //   id: "maxGrade",
      //   label: "Max Grade",
      //   type: FieldType.NUMBER,
      //   validation: {
      //     type: ["number", "should be a number"],
      //     min: ["startDate", "should be greater than start date"],
      //     positive: ["should be positive"],
      //   },
      // },
      // {
      //   id: "date",
      //   label: "Date",
      //   type: FieldType.DATE,
      //   validation: {
      //     type: ["date", "should be a number"],
      //     minDate: [new Date(), "should be greater than today"],
      //     maxDate: [
      //       (() => {
      //         const date = new Date();
      //         date.setDate(date.getDate() + 7);
      //         return date;
      //       })(),
      //       "should be less than today",
      //     ],
      //   },
      // },
    ],
  },
  decorators: [Wrapper],
};

export const SimpleFormWithCustomComponent: Story = {
  args: {
    debug: true,
    direction: Direction.COLUMN,
    commonFieldProps: {
      inputProps: { colorScheme: "red" } as any,
    },
    onSubmit: (data) => {
      alert(`Values: ${JSON.stringify(data)}`);
    },
    fields: [
      {
        id: "radio",
        label: "Radio",
        type: FieldType.RADIO,
        hasTitle: true,
        direction: Direction.ROW,
        options: [
          { value: "1", label: "Option 1" },
          { value: "2", label: "Option 2" },
          { value: "3", label: "Option 3" },
        ],
        defaultValue: "2",
        component: ({ field }) => {
          const fieldRegister = field.register(field.id);
          return (
            <div>
              <label>{field.label}</label>
              <h4>Hello world!</h4>
              <span>defaultValue: {field.defaultValue}</span>
            </div>
          );
        },
      },
      {
        id: "file",
        label: "File",
        type: FieldType.FILE,
      },
      // {
      //   id: "username",
      //   label: "Username",
      //   type: FieldType.TEXT,
      //   defaultValue: "test@com",
      //   validation: {
      //     type: ["string", "should be a string"],
      //     required: [true, "this is required"],
      //     format: ["email", "should be an email"],
      //     trim: [],
      //     uppercase: [],
      //   },
      // },
      // {
      //   id: "matches",
      //   label: "Matches",
      //   type: FieldType.TEXT,
      //   validation: {
      //     type: ["string", "should be a string"],
      //     matches: [/^[a-zA-Z]+$/, "should be only letters"],
      //     minLength: [3, "should be at least 3 characters"],
      //   },
      // },
      // {
      //   id: "not required",
      //   label: "Not Required",
      //   type: FieldType.TEXT,
      //   validation: {
      //     type: ["string", "should be a string"],
      //     notRequired: [true, "this is not required"],
      //   },
      // },
      // {
      //   id: "enum",
      //   label: "Enum",
      //   type: FieldType.TEXT,
      //   validation: {
      //     type: ["string", "should be a string"],
      //     enum: [["perro", "gato"], "should be perro or gato"],
      //   },
      // },
      // {
      //   id: "minGrade",
      //   label: "Min Grade",
      //   type: FieldType.NUMBER,
      //   validation: {
      //     type: ["number", "should be a number"],
      //     required: [true, "this is required"],
      //     negative: ["should be negative"],
      //   },
      // },
      // {
      //   id: "maxGrade",
      //   label: "Max Grade",
      //   type: FieldType.NUMBER,
      //   validation: {
      //     type: ["number", "should be a number"],
      //     min: ["startDate", "should be greater than start date"],
      //     positive: ["should be positive"],
      //   },
      // },
      // {
      //   id: "date",
      //   label: "Date",
      //   type: FieldType.DATE,
      //   validation: {
      //     type: ["date", "should be a number"],
      //     minDate: [new Date(), "should be greater than today"],
      //     maxDate: [
      //       (() => {
      //         const date = new Date();
      //         date.setDate(date.getDate() + 7);
      //         return date;
      //       })(),
      //       "should be less than today",
      //     ],
      //   },
      // },
    ],
  },
  decorators: [Wrapper],
};

// export const FormWithAllTypes: Story = {
//   args: {
//     direction: Direction.COLUMN,
//     commonFieldProps: {
//       inputProps: { colorScheme: "red" } as any,
//     },
//     fields: [
//       { id: "username", label: "Username", type: FieldType.TEXT },
//       { id: "password", label: "Password", type: FieldType.PASSWORD },
//       { id: "email", label: "Email", type: FieldType.EMAIL },
//       { id: "tel", label: "Telephone", type: FieldType.TELEPHONE },
//       { id: "number", label: "Number", type: FieldType.NUMBER },
//       { id: "date", label: "Date", type: FieldType.DATE },
//       { id: "time", label: "Time", type: FieldType.TIME },
//       {
//         id: "datetime-local",
//         label: "Datetime Local",
//         type: FieldType.DATETIME_LOCAL,
//       },
//       { id: "month", label: "Month", type: FieldType.MONTH },
//       { id: "week", label: "Week", type: FieldType.WEEK },
//       { id: "url", label: "URL", type: FieldType.URL },
//       { id: "search", label: "Search", type: FieldType.SEARCH },
//       { id: "color", label: "Color", type: FieldType.COLOR },
//       { id: "textarea", label: "Textarea", type: FieldType.TEXTAREA },
//       {
//         id: "select",
//         label: "Select",
//         placeholder: "Select an option",
//         type: FieldType.SELECT,
//         options: [
//           { value: "1", label: "Option 1" },
//           { value: "2", label: "Option 2" },
//           { value: "3", label: "Option 3" },
//         ],
//       },
//       { id: "checkbox", label: "Checkbox", type: FieldType.CHECKBOX },
//       {
//         id: "radio",
//         label: "Radio",
//         type: FieldType.RADIO,
//         options: [
//           { value: "1", label: "Option 1" },
//           { value: "2", label: "Option 2" },
//           { value: "3", label: "Option 3" },
//         ],
//       },
//       { id: "file", label: "File", type: FieldType.FILE },
//       { id: "hidden", label: "Hidden", type: FieldType.HIDDEN },
//       { id: "reset", label: "Reset", type: FieldType.RESET },
//       { id: "submit", label: "Submit", type: FieldType.SUBMIT },
//     ],
//   },
//   decorators: [Wrapper],
// };
