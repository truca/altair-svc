import { createSchema } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ModelDirective } from "./ModelDirective";
import { MongoStore } from "./MongoStore";
import { GraphQLID } from "graphql";
import { config } from "dotenv";

config();
const typeDefinitions = /* GraphQL */ `
  scalar ID
  directive @model on OBJECT

  type Author @model {
    name: String!
    books: [Book]
    favoriteBook: Book
  }

  type Book @model {
    name: String!
    authors: [Author]
  }

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

const resolvers = {
  ID: GraphQLID,
  Query: {},
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
