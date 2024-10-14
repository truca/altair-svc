import { makeSchema } from "../lib/utils";
import { FormTypes } from "../lib/types";
import { FORMS } from "./forms";

const typeDefinitions = /* GraphQL */ `
  scalar ID
  scalar File
  directive @model on OBJECT
  directive @file(maxSize: Float!, types: [String!]!) on FIELD_DEFINITION
  directive @auth(
    create: [String]
    read: [String]
    update: [String]
    delete: [String]
  ) on OBJECT | FIELD_DEFINITION
  directive @connection(type: String) on FIELD_DEFINITION

  type Author
    @model
    @auth(
      create: ["public"]
      read: ["owner"]
      update: ["owner"]
      delete: ["owner"]
    ) {
    name: String!
    books: [Book]
    """
    The author's favorite book.
    """
    favoriteBook: Book
  }

  type Book @model {
    avatar: String @file(maxSize: 1000000, types: ["image/jpeg", "image/png"])
    name: String!
    authors: [Author]
  }

  type Chat
    @model
    @auth(
      create: ["public"]
      read: ["owner", "collaborator"]
      update: ["owner"]
      delete: ["owner"]
    ) {
    name: String!
    messages: [Message] @connection(type: "search")
  }

  type Message
    @model
    @auth(
      create: ["owner|chats:chat", "collaborator|chats:chat"]
      read: ["owner|chats:chat", "collaborator|chats:chat"]
      update: [""]
      delete: [""]
    ) {
    text: String!
    chat: Chat
  }

  type Profile @model {
    uid: String
    displayName: String!
    email: String!
    photoURL: String
    phoneNumber: String
    emailVerified: Boolean
    isAnonymous: Boolean
    lastSignInTime: String
    creationTime: String
    roles: [String]
  }

  enum FieldType {
    TEXT
    TEXTAREA
    NUMBER
    EMAIL
    PASSWORD
    CHECKBOX
    RADIO
    SELECT
    DATE
    TIME
    DATETIME
    FILE
    IMAGE
    URL
    TEL
    COLOR
    RANGE
    SEARCH
    HIDDEN
    SUBMIT
    RESET
    BUTTON
  }

  enum ValueType {
    STRING
    BOOLEAN
    NUMBER
    FILE
    MIXED
  }

  type FieldValidation {
    label: String!
    value: String
    valueType: ValueType
    errorMessage: String
  }

  type FieldOption {
    label: String
    value: String
  }

  type Field {
    label: String
    field: String
    type: FieldType
    defaultValue: String
    options: [FieldOption]
    validation: [FieldValidation]
  }

  type Form {
    fields: [Field]
  }

  enum FormType {
    AUTHOR
    BOOK
    PROFILE
  }

  type Query {
    _: Boolean
    form(type: FormType): Form
  }

  type Mutation {
    _: Boolean
    readTextFile(file: File!): String!
    saveFile(file: File!): Boolean!
    authenticate(
      uid: String
      displayName: String
      email: String
      photoURL: String
      phoneNumber: String
      emailVerified: Boolean
      isAnonymous: Boolean
    ): String
  }
`;

const formTypes: FormTypes = {
  AUTHOR: "author",
  BOOK: "book",
  PROFILE: "profile",
};

export const schema = makeSchema({
  typeDefs: typeDefinitions,
  formTypes,
  forms: FORMS,
  queries: {},
  mutations: {},
});
