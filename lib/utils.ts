import { createSchema } from "graphql-yoga";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ModelDirective } from "./ModelDirective";
import { MongoStore } from "./MongoStore";
import { GraphQLID } from "graphql";
import { FORMS } from "../src/forms";
import _ from "lodash";
import { CookieStore, FormsHash, Profile } from "./types";
import { config } from "dotenv";
import { parse } from "node:path";
config();

const jwt = require("jsonwebtoken");
const fs = require(`fs`);
const path = require(`path`);

// Interface for the function result
export interface VerifyTokenResult {
  decoded?: object | string;
  error?: string;
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
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: refreshMaxAge,
    });
  }

  const maxAge = parseInt(
    process.env.ACCESS_TOKEN_DURATION_SECONDS as string,
    10
  );
  cookieStore.set("accessToken", tokens.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge,
  });
}

export function makeContext({ context: contextArg }: any) {
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
      authenticate: async (_: any, params: Profile, context: any) => {
        const secretKey = process.env.JWT_SECRET;
        let profile = await context.directives.model.store.findOne({
          where: { uid: params.uid, deletedAt: null },
          type: { name: "Profile" },
        });
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
