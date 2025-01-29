import { makeSchema } from "../lib/utils";
import { FormTypes } from "../lib/types";
import { FORMS } from "./forms";

const typeDefinitions = /* GraphQL */ `
  scalar ID
  scalar File
  scalar DateTime
  directive @model on OBJECT
  directive @file(maxSize: Float!, types: [String!]!) on FIELD_DEFINITION
  directive @auth(
    create: [String]
    read: [String]
    update: [String]
    delete: [String]
  ) on OBJECT | FIELD_DEFINITION
  directive @connection(type: String) on FIELD_DEFINITION
  directive @subscribe(on: [String], topic: String) on OBJECT

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
    CHAT
  }

  # Represents a user.  Supports: User Registration and Login, Profile Customization, In-App Messaging, Integration with Other Platforms, Notifications and Updates.
  type Profile @model @auth(read: ["public"]) {
    uid: String
    username: String
    profilePicture: String
    createdAt: DateTime!
    updatedAt: DateTime
  }

  input ObjectId {
    id: ID!
  }

  input ProfileInputType2 {
    uid: String
    username: String
    profilePicture: String
    lat: Float
    lng: Float
    createdAt: DateTime
    updatedAt: DateTime
    favoriteWarbands: [ObjectId]
    favoriteCards: [ObjectId]
    # collection: Collection
    participatedEvents: [ObjectId] # Events the user participated in
    wonMatches: [ObjectId] # Matches this user won
    wonTournaments: [ObjectId] # Tournaments this user won
  }

  type ProductManager @model @auth(read: ["public"]) {
    externalId: ID!
    name: String!
    email: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Seller @model @auth(read: ["public"]) {
    externalId: ID!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Brand @model @auth(read: ["public"]) {
    externalId: ID!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Category @model @auth(read: ["public"]) {
    externalId: ID!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Subcategory @model @auth(read: ["public"]) {
    externalId: ID!
    name: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Query {
    _: Boolean
    me(uid: String): Profile
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
      createCookies: Boolean
    ): String
    updateMe(id: String, profile: ProfileInputType2): Profile
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
