import { createSchema } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ModelDirective } from "./ModelDirective";
import { MongoStore } from "./MongoStore";
import { GraphQLID } from "graphql";
import { config } from "dotenv";
import { FORMS } from "./form";

config();
const typeDefinitions = /* GraphQL */ `
  scalar ID
  directive @model on OBJECT

  type Author @model {
    name: String!
    books: [Book]
    """
    The author's favorite book.
    """
    favoriteBook: Book
  }

  type Book @model {
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
};

export const context = {
  directives: {
    model: {
      store: new MongoStore({
        connection: `${process.env.DB_URI}/${process.env.DATABASE}`,
      }),
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
