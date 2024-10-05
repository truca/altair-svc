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
        res: {
          ...(args as any)?.res,
          // create cookieStore bound to res object
          cookieStore: {
            get: function (key: string) {
              return cookies[key];
            },
            set: function (key: string, value: string, options: any) {
              (args as any)?.res?.setHeader?.(
                "Set-Cookie",
                cookie.serialize(key, value, options)
              );
            },
            remove: function (key: string) {
              (args as any)?.res?.setHeader?.(
                "Set-Cookie",
                cookie.serialize(key, "", { maxAge: -1 })
              );
            },
          },
        },
      };
    },
    // Hook for setting headers (like Set-Cookie) in the response
    // @ts-ignore
    onResponse: ({ response, context }) => {
      console.log("onResponse", context.setCookies);
      // Append each cookie to the response
      // @ts-ignore
      context.setCookies.forEach(({ name, value, options }) => {
        response.headers.append(
          "Set-Cookie",
          cookie.serialize(name, value, options)
        );
      });
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
