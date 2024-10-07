import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";

import { schema } from "./schema";
import { context } from "./context";
import { config } from "dotenv";
import { generateTokens, setTokensAsCookies, verifyToken } from "../lib/utils";
import { CookieStore } from "../lib/types";
import { error } from "node:console";
config();

const cookie = require("cookie");
const jwt = require("jsonwebtoken");

function getCookieStore(context: any, cookies: any): CookieStore {
  const ctx: any = context;
  const getCookie = (paramCookies: any) => (key: string) => paramCookies[key];
  const setCookie =
    (res: any) => (key: string, value: string, options: any) => {
      const existingCookies = res.getHeader("Set-Cookie") || [];
      const cookiesArray = Array.isArray(existingCookies)
        ? existingCookies
        : [existingCookies];
      cookiesArray.push(cookie.serialize(key, value, options));

      res?.setHeader?.("Set-Cookie", cookiesArray);
    };
  const removeCookie = (res: any) => (key: string) => {
    res?.setHeader?.("Set-Cookie", cookie.serialize(key, "", { maxAge: -1 }));
  };

  return {
    get: getCookie(cookies),
    set: setCookie(ctx.res),
    remove: removeCookie(ctx.res),
  };
}

async function getSession(
  accessToken: string,
  refreshToken: string,
  cookieStore: CookieStore
) {
  const decodedAccessToken = verifyToken(
    accessToken,
    process.env.JWT_SECRET as any
  );
  const decodedRefreshToken = verifyToken(
    refreshToken,
    process.env.JWT_SECRET as any
  );
  if (decodedAccessToken.error && decodedRefreshToken.error) return null;
  // use the refresh token to get a new access token
  if (decodedAccessToken.error) {
    // get the user id from the refresh token
    const { userId } = decodedRefreshToken.decoded as any;
    // get the user from the database
    let profile = await context.directives.model.store.findOne({
      where: { uid: userId, deletedAt: null },
      type: { name: "Profile" },
    });
    if (!profile) return null;
    // generate a new access token
    const tokens = generateTokens(profile);
    setTokensAsCookies(cookieStore, tokens, false);
    // return the session
    return profile;
  }
  // validate the access token
  // return the session
  return decodedAccessToken.decoded;
}

function main() {
  const yoga = createYoga({
    schema,
    context: async (args) => {
      const cookies = cookie.parse((args as any)?.req?.headers?.cookie || "");
      const cookieStore = getCookieStore(args, cookies);
      const session = await getSession(
        cookies.accessToken,
        cookies.refreshToken,
        cookieStore
      );
      return {
        ...context,
        ...args,
        cookies,
        session,
        cookieStore,
      };
    },
  });
  const server = createServer(yoga);
  server.listen(process.env.PORT, () => {
    console.info(
      `Server is running on http://localhost:${process.env.PORT}/graphql`
    );
  });
}

main();
