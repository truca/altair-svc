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

// type ProductManager @model @auth(read: ["public"], delete: ["public"]) {
//   externalId: ID!
//   name: String!
//   email: String!
//   createdAt: DateTime
//   updatedAt: DateTime
// }
export const PRODUCT_MANAGER_FORM: Field[] = [
  {
    label: "externalId",
    type: FieldType.TEXT,
    validation: [
      {
        label: "type",
        value: "string",
        valueType: ValueType.STRING,
        errorMessage: "External ID should be a string",
      },
      {
        label: "required",
        value: "true",
        valueType: ValueType.BOOLEAN,
        errorMessage: "External ID is required",
      },
    ],
  },
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
    label: "email",
    type: FieldType.TEXT,
    validation: [
      {
        label: "type",
        value: "string",
        valueType: ValueType.STRING,
        errorMessage: "Email should be a string",
      },
      {
        label: "required",
        value: "true",
        valueType: ValueType.BOOLEAN,
        errorMessage: "Email is required",
      },
    ],
  },
];

// type Seller @model @auth(read: ["public"]) {
//   externalId: ID!
//   name: String!
//   createdAt: DateTime
//   updatedAt: DateTime
// }

export const SELLER_FORM: Field[] = [
  {
    label: "externalId",
    type: FieldType.TEXT,
    validation: [
      {
        label: "type",
        value: "string",
        valueType: ValueType.STRING,
        errorMessage: "External ID should be a string",
      },
      {
        label: "required",
        value: "true",
        valueType: ValueType.BOOLEAN,
        errorMessage: "External ID is required",
      },
    ],
  },
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

// type Brand @model @auth(read: ["public"]) {
//   externalId: ID!
//   name: String!
//   createdAt: DateTime
//   updatedAt: DateTime
// }

export const BRAND_FORM: Field[] = [
  {
    label: "externalId",
    type: FieldType.TEXT,
    validation: [
      {
        label: "type",
        value: "string",
        valueType: ValueType.STRING,
        errorMessage: "External ID should be a string",
      },
      {
        label: "required",
        value: "true",
        valueType: ValueType.BOOLEAN,
        errorMessage: "External ID is required",
      },
    ],
  },
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

// type Category @model @auth(read: ["public"]) {
//   externalId: ID!
//   name: String!
//   createdAt: DateTime
//   updatedAt: DateTime
// }

export const CATEGORY_FORM: Field[] = [
  {
    label: "externalId",
    type: FieldType.TEXT,
    validation: [
      {
        label: "type",
        value: "string",
        valueType: ValueType.STRING,
        errorMessage: "External ID should be a string",
      },
      {
        label: "required",
        value: "true",
        valueType: ValueType.BOOLEAN,
        errorMessage: "External ID is required",
      },
    ],
  },
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

// type Subcategory @model @auth(read: ["public"]) {
//   externalId: ID!
//   name: String!
//   createdAt: DateTime
//   updatedAt: DateTime
// }

export const SUBCATEGORY_FORM: Field[] = [
  {
    label: "externalId",
    type: FieldType.TEXT,
    validation: [
      {
        label: "type",
        value: "string",
        valueType: ValueType.STRING,
        errorMessage: "External ID should be a string",
      },
      {
        label: "required",
        value: "true",
        valueType: ValueType.BOOLEAN,
        errorMessage: "External ID is required",
      },
    ],
  },
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
  productManager: PRODUCT_MANAGER_FORM,
  seller: SELLER_FORM,
  brand: BRAND_FORM,
  category: CATEGORY_FORM,
  subcategory: SUBCATEGORY_FORM,
};
