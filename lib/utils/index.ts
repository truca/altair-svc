import { makeExecutableSchema } from "@graphql-tools/schema";
import { ModelDirective } from "../ModelDirective";
import { StaticModelDirective } from "../StaticModelDirective";
import { createStore, DbTypes } from "../stores/utils";
import { CookieStore, FormsHash, Profile } from "../types";

import { GraphQLID } from "graphql";
import _ from "lodash";
import * as jwt from "jsonwebtoken";
import * as fs from "fs";
import * as path from "path";
import { Store } from "../stores/types";

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
    { email: profile.email },
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
      maxAge: refreshMaxAge,
    });
  }

  const maxAge = parseInt(
    process.env.ACCESS_TOKEN_DURATION_SECONDS as string,
    10
  );
  cookieStore.set("accessToken", tokens.accessToken, {
    maxAge,
  });
}

function connectDatabases(schema?: any) {
  // const dbCountEnv = process.env.DB_COUNT || "1";
  // if (!dbCountEnv) throw new Error("DB_COUNT environment variable not set");
  // const dbCount = parseInt(dbCountEnv, 10) || 2; // Default to 2 if not specified

  const dbs: { [key: string]: Store } = {};
  // for (let i = 1; i <= dbCount; i++) {

  const dbType: DbTypes = process.env.DB_ENGINE as DbTypes;
  const dbName: string = process.env.DB_INTERNAL_NAME as string;
  const dbOptions = {
    name: process.env.FIRESTORE_DB_NAME,
  };

  if (!dbType || !dbName) {
    throw new Error("DB_TYPE and DB_NAME environment variables are required");
  }

  dbs[dbName] = createStore(dbType, dbOptions, schema);
  // }

  console.log({ dbs });
  return dbs;
}

export function makeContext({
  context: contextArg,
  schema,
}: {
  context: any;
  schema?: any;
}) {
  const databases = connectDatabases(schema);

  const context = {
    ...contextArg,
    directives: {
      model: { ...databases },
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
  queries?: { [key: string]: () => object };
  mutations?: { [key: string]: () => object };
  subscriptions?: { [key: string]: () => object };
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
      me: async (
        _: any,
        params: { email: string },
        context: any,
        info: any
      ) => {
        const profileType = context?.typeMap?.Profile;
        const args = {
          where: { email: params.email || context?.session?.email },
        };
        return StaticModelDirective.findOneQueryResolver(profileType)(
          _,
          args,
          context,
          info
        );
      },
      getServicesBetweenDates: async (
        _: any,
        params: any,
        context: any,
        info: any
      ) => {
        const profileType = context?.typeMap?.Service;
        const startDateValue =
          params.startDate && params.endDate
            ? `>=${params.startDate},<=${params.endDate}`
            : params.startDate
              ? `>=${params.startDate}`
              : params.endDate
                ? `<=${params.endDate}`
                : null;
        const args = {
          ...params,
          pageSize: params.pageSize || 10,
          page: params.page || 1,
          where: {
            ...params.where,
            ...(params.serviceType ? { serviceType: params.serviceType } : {}),
            ...(startDateValue ? { startDate: startDateValue } : {}),
          },
        };
        return StaticModelDirective.findQueryResolver(profileType)(
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
            new Uint8Array(fileArrayBuffer)
          );
        } catch (e) {
          console.log({ e });
          return false;
        }
        return true;
      },
      login: async (
        _: any,
        params: { email: string; password: string },
        context: any
      ) => {
        const info = null;

        const profile = await context.directives.model.store.findOne(
          {
            where: { email: params.email },
            type: { name: "Profile" },
          },
          context,
          info,
          true
        );

        if (!profile) {
          throw new Error("Usuario no encontrado");
        }

        if (profile.password !== params.password) {
          throw new Error("Contraseña incorrecta");
        }

        const tokens = generateTokens(profile);
        setTokensAsCookies(context.cookieStore, tokens);

        return { token: tokens.accessToken, country: profile.country };
      },

      register: async (
        _: any,
        params: {
          email: string;
          password: string;
          username?: string;
          profilePicture?: string;
        },
        context: any
      ) => {
        const info = null;

        const existingUser = await context.directives.model.store.findOne(
          {
            where: { email: params.email, deletedAt: null },
            type: { name: "Profile" },
          },
          context,
          info,
          true
        );

        if (existingUser) {
          throw new Error("Ya existe un usuario con este email");
        }

        const profile = await context.directives.model.store.create(
          {
            data: {
              ...params,
              role: "user",
              deletedAt: null,
            },
            type: { name: "Profile" },
          },
          context,
          info
        );

        if (!profile) {
          throw new Error("Error al crear el usuario");
        }

        const tokens = generateTokens(profile);
        setTokensAsCookies(context.cookieStore, tokens);

        if (!tokens.accessToken) {
          throw new Error("Error al generar el token de autenticación");
        }

        return { token: tokens.accessToken, country: profile.country };
      },
      updateMe: async (
        _: any,
        params: { id: string; profile: Profile },
        context: any
      ) => {
        // update the profile of the user
        const info = null;
        const profile = await context.directives.model.store.update(
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
