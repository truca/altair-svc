import { createServer } from "http";
import { createYoga } from "graphql-yoga";

import { schema } from "./schema";
import { createContext, serveFile } from "../lib/utils";

import { config } from "dotenv";
config();

async function main() {
  const context = createContext(schema);
  const yoga = createYoga({
    schema,
    context,
    cors: {
      origin: "*",
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "x-api-key"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
  });

  const server = createServer(async (req, res) => {
    // Health check endpoint
    if (req.url === "/healthcheck" || req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({ status: "OK", timestamp: new Date().toISOString() })
      );
      return;
    }

    // Serve static files first
    if (req.url?.startsWith("/uploads") || req.url === "/") {
      await serveFile(req, res);
    } else {
      // Delegate to the GraphQL Yoga server
      yoga.handle(req, res);
    }
  });

  server.listen(process.env.PORT, () => {
    console.info(
      `Server is running on http://localhost:${process.env.PORT}/graphql`
    );
  });
}

main();
