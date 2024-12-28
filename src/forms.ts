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

export const WARBAND_FORM_STEP_1: Field[] = [
  // name
  {
    label: "Name",
    field: "name",
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
  // faction
  {
    label: "Faction",
    field: "faction",
    type: FieldType.SELECT,
    options: [
      { label: "Chaos", value: "chaos" },
      { label: "Corruption", value: "corruption" },
      { label: "Fortitude", value: "fortitude" },
      { label: "Order", value: "order" },
      { label: "Wild", value: "wild" },
    ],
  },
  // glory_points
  {
    label: "Glory Points",
    field: "glory_points",
    type: FieldType.NUMBER,
    validation: [
      {
        label: "type",
        value: "number",
        valueType: ValueType.NUMBER,
        errorMessage: "Glory Points should be a number",
      },
      {
        label: "required",
        value: "true",
        valueType: ValueType.BOOLEAN,
        errorMessage: "Glory Points is required",
      },
      {
        label: "min",
        value: "80",
        valueType: ValueType.NUMBER,
        errorMessage: "Glory Points should be at least 80",
      },
    ],
  },
  // guild_upgrades
  {
    label: "Guild Upgrades",
    field: "guild_upgrades",
    type: FieldType.NUMBER,
    validation: [
      {
        label: "type",
        value: "number",
        valueType: ValueType.NUMBER,
        errorMessage: "Guild Upgrades should be a number",
      },
      {
        label: "required",
        value: "true",
        valueType: ValueType.BOOLEAN,
        errorMessage: "Guild Upgrades is required",
      },
      {
        label: "min",
        value: "0",
        valueType: ValueType.NUMBER,
        errorMessage: "Guild Upgrades should be at least 0",
      },
    ],
  },
];

export const WARBAND_FORM_STEP_2: Field[] = [
  {
    label: "Select Guild Upgrades",
    field: "selected_guild_upgrades",
    // the ids of the selected options
    type: FieldType.TEXT_ARRAY,
    component: "GuildUpgradesSelect",
    options: "guildUpgrades",
    defaultValue: ["Guildhall"],
    optionsMap: { label: "name", value: "name", cost: "cost" },
    valuePerOption: "cost",
    validation: [
      {
        label: "type",
        value: "array",
        valueType: ValueType.MIXED,
        errorMessage: "Guild Upgrades should be an array",
      },
      {
        label: "required",
        value: "true",
        valueType: ValueType.BOOLEAN,
        errorMessage: "Guild Upgrades is required",
      },
      {
        label: "min",
        value: "0",
        valueType: ValueType.NUMBER,
        errorMessage: "Guild Upgrades should be at least 0",
      },
      // {
      //   label: "max",
      //   value: "value:guild_upgrades",
      //   valueType: ValueType.NUMBER,
      //   errorMessage: "Guild Upgrades should be at most 3",
      // },
    ],
  },
];

export const FORMS: FormsHash = {
  author: AUTHOR_FORM,
  book: BOOK_FORM,
  chat: CHAT_FORM,
};
