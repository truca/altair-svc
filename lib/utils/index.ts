import { makeExecutableSchema } from "@graphql-tools/schema";
import { ModelDirective } from "../ModelDirective";
import { StaticModelDirective } from "../StaticModelDirective";
import { MongoStore } from "../MongoStore";
import { CookieStore, FormsHash, Profile } from "../types";

import { GraphQLID } from "graphql";
import _ from "lodash";
import { createPubSub } from "graphql-yoga";

const pubSub = createPubSub();

import { config } from "dotenv";
config();

const jwt = require("jsonwebtoken");
const fs = require(`fs`);
const path = require(`path`);

// Interface for the function result
export interface VerifyTokenResult {
  decoded?: object | string;
  error?: string;
}

interface Message {
  id: string;
  chatId: string;
  text: string;
}

// Secure token verification method
export function verifyToken(token: string, secret: string): VerifyTokenResult {
  if (!token) {
    return { error: "MissingTokenError" };
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, secret);

    // Return the decoded payload if verification is successful
    return { decoded };
  } catch (error: any) {
    // Handle specific token-related errors
    if (error.name === "TokenExpiredError") {
      return { error: "TokenExpiredError" }; // Handle token expiration
    } else if (error.name === "JsonWebTokenError") {
      return { error: "InvalidTokenError" }; // Handle other token-related errors
    } else {
      return { error: "UnknownError" }; // Catch-all for other unknown errors
    }
  }
}

export function generateTokens(profile: Profile) {
  const secretKey = process.env.JWT_SECRET;
  const accessTokenExpiresIn = parseInt(
    process.env.ACCESS_TOKEN_DURATION_SECONDS as string,
    10
  );
  const accessToken = jwt.sign(
    profile,
    secretKey as string,
    { expiresIn: accessTokenExpiresIn } // Token expires in 1 hour
  );

  const refreshTokenExpiresIn = parseInt(
    process.env.REFRESH_TOKEN_DURATION_SECONDS as string,
    10
  );
  const refreshToken = jwt.sign(
    { userId: profile.uid },
    secretKey as string,
    { expiresIn: refreshTokenExpiresIn } // Token expires in 7 days
  );
  return { accessToken, refreshToken };
}

export function setTokensAsCookies(
  cookieStore: CookieStore,
  tokens: { accessToken: string; refreshToken: string },
  setRefreshToken = true
) {
  if (setRefreshToken) {
    const refreshMaxAge = parseInt(
      process.env.REFRESH_TOKEN_DURATION_SECONDS as string,
      10
    );
    cookieStore.set("refreshToken", tokens.refreshToken, {
      // httpOnly: true,
      // secure: true,
      // sameSite: "none",
      maxAge: refreshMaxAge,
    });
  }

  const maxAge = parseInt(
    process.env.ACCESS_TOKEN_DURATION_SECONDS as string,
    10
  );
  cookieStore.set("accessToken", tokens.accessToken, {
    // httpOnly: true,
    // secure: true,
    // sameSite: "none",
    maxAge,
  });
}

export function makeContext({ context: contextArg }: any) {
  const store = new MongoStore({
    connection: `${process.env.DB_URI}/${process.env.DATABASE}`,
  });

  const context = {
    ...contextArg,
    directives: {
      model: { store },
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
  subscriptions?: { [key: string]: () => {} };
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
      me: async (_: any, params: { uid: String }, context: any, info: any) => {
        const profileType = context?.typeMap?.Profile;
        const args = { where: { uid: params.uid } };
        return StaticModelDirective.findOneQueryResolver(profileType)(
          _,
          args,
          context,
          info
        );
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
      authenticate: async (_: any, params: Profile, context: any) => {
        const info = null;
        let profile = await context.directives.model.store.findOne(
          {
            where: { uid: params.uid, deletedAt: null },
            type: { name: "Profile" },
          },
          context,
          info,
          true
        );
        if (profile) {
          const tokens = generateTokens(profile);
          setTokensAsCookies(context.cookieStore, tokens);

          return tokens.accessToken;
        }

        profile = await context.directives.model.store.create({
          data: {
            ...params,
            role: "user",
          },
          type: { name: "Profile" },
        });

        if (!profile) {
          return null;
        }

        const tokens = generateTokens(profile);
        setTokensAsCookies(context.cookieStore, tokens);
        return tokens.accessToken;
      },
      updateMe: async (
        _: any,
        params: { id: String; profile: Profile },
        context: any
      ) => {
        // update the profile of the user
        const info = null;
        let profile = await context.directives.model.store.update(
          {
            where: { _id: params.id, deletedAt: null },
            data: {
              ...params.profile,
            },
            upsert: false,
            type: { name: "Profile" },
          },
          context,
          info,
          true
        );
        return profile;
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
