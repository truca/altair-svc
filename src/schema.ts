import { createSchema } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ModelDirective } from "./ModelDirective";
import { MongoStore } from "./MongoStore";
import { GraphQLID } from "graphql";
import { config } from "dotenv";
import { FORMS } from "./form";

const fs = require(`fs`);
const path = require(`path`);

config();
const typeDefinitions = /* GraphQL */ `
  scalar ID
  scalar File
  directive @model on OBJECT
  directive @file(maxSize: Float!, types: [String!]!) on FIELD_DEFINITION

  type Author @model {
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

  type Field {
    label: String
    type: FieldType
    defaultValue: String
    validation: [FieldValidation]
  }

  type Form {
    fields: [Field]
  }

  enum FormType {
    AUTHOR
    BOOK
  }

  type Query {
    _: Boolean
    form(type: FormType): Form
  }

  type Mutation {
    _: Boolean
    readTextFile(file: File!): String!
    saveFile(file: File!): Boolean!
  }
`;

const resolvers = {
  ID: GraphQLID,
  FormType: {
    AUTHOR: "author",
    BOOK: "book",
  },
  Query: {
    form: async (_: any, { type }: { id: string; type: string }) => {
      if (FORMS[type]) {
        return { fields: FORMS[type] };
      }
      return {
        fields: [],
      };
    },
  },
  Mutation: {
    readTextFile: async (_: any, { file }: { file: File }) => {
      const textContent = await file.text();
      return textContent;
    },

    saveFile: async (_: any, { file }: { file: File }) => {
      try {
        const fileArrayBuffer = await file.arrayBuffer();
        await fs.promises.writeFile(
          path.join(__dirname, file.name),
          Buffer.from(fileArrayBuffer)
        );
      } catch (e) {
        console.log({ e });
        return false;
      }
      return true;
    },
  },
};

export const context = {
  directives: {
    model: {
      store: new MongoStore({
        connection: `${process.env.DB_URI}/${process.env.DATABASE}`,
      }),
    },
    file: {
      maxSize: 1000000,
      types: ["image/jpeg", "image/png"],
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs: typeDefinitions,
  resolvers,
  schemaDirectives: {
    model: ModelDirective,
  },
});
