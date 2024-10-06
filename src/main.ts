import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";

import { schema } from "./schema";
import { context } from "./context";
import { config } from "dotenv";
config();

const cookie = require("cookie");

function main() {
  const yoga = createYoga({
    schema,
    context: async (args) => {
      const cookies = cookie.parse((args as any)?.req?.headers?.cookie || "");
      return {
        ...context,
        ...args,
        cookies,
        cookieStore: {
          get: ((paramCookies) =>
            function (key: string) {
              return paramCookies[key];
            })(cookies),
          set: ((res) =>
            function (key: string, value: string, options: any) {
              const existingCookies = res.getHeader("Set-Cookie") || [];
              const cookiesArray = Array.isArray(existingCookies)
                ? existingCookies
                : [existingCookies];
              cookiesArray.push(cookie.serialize(key, value, options));

              res?.setHeader?.("Set-Cookie", cookiesArray);
            })((args as any)?.res),
          remove: ((res) =>
            function (key: string) {
              res?.setHeader?.(
                "Set-Cookie",
                cookie.serialize(key, "", { maxAge: -1 })
              );
            })((args as any)?.res),
        },
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
