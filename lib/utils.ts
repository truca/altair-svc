import { createSchema } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ModelDirective } from "./ModelDirective";
import { MongoStore } from "./MongoStore";
import { GraphQLID } from "graphql";
import { FORMS } from "../src/forms";
import _ from "lodash";
import { FormsHash, Profile } from "./types";
import { config } from "dotenv";
config();

const jwt = require("jsonwebtoken");
const fs = require(`fs`);
const path = require(`path`);

export function makeContext({ context: contextArg }: { context: any }) {
  const context = {
    ...contextArg,
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
      ...contextArg.directives,
    },
  };

  return context;
}

export function makeSchema({
  typeDefs,
  formTypes,
  forms = {},
  queries = {},
  mutations = {},
}: {
  typeDefs: string;
  formTypes: Record<string, string>;
  forms?: FormsHash;
  queries?: { [key: string]: () => {} };
  mutations?: { [key: string]: () => {} };
}) {
  const resolvers = {
    ID: GraphQLID,
    FormType: {
      ...formTypes,
    },
    Query: {
      form: async (_: any, { type }: { id: string; type: string }) => {
        if (forms[type]) {
          return { fields: forms[type] };
        }
        return {
          fields: [],
        };
      },
      ...queries,
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
      authenticate: async (
        _: any,
        {
          displayName,
          email,
          photoURL,
          uid,
          phoneNumber,
          emailVerified,
          isAnonymous,
        }: Profile,
        context: any
      ) => {
        const secretKey = process.env.JWT_SECRET;
        let profile = await context.directives.model.store.findOne({
          where: { uid, deletedAt: null },
          type: { name: "Profile" },
        });
        if (profile) {
          const token = jwt.sign(
            profile,
            secretKey as string,
            { expiresIn: "1h" } // Token expires in 1 hour
          );

          return token;
        }

        profile = await context.directives.model.store.create({
          data: {
            uid,
            displayName,
            email,
            role: "user",
            photoURL,
            phoneNumber,
            emailVerified,
            isAnonymous,
          },
          type: { name: "Profile" },
        });

        if (!profile) {
          return null;
        }

        const token = jwt.sign(
          profile,
          secretKey as string,
          { expiresIn: "1h" } // Token expires in 1 hour
        );
        return token;
      },
      ...mutations,
    },
  };

  return makeExecutableSchema({
    typeDefs,
    resolvers,
    schemaDirectives: {
      model: ModelDirective,
    },
  });
}
