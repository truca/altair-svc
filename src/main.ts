import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema";
import { context } from "./context";
import { config } from "dotenv";
config();

function main() {
  const yoga = createYoga({ schema, context });
  const server = createServer(yoga);
  server.listen(process.env.PORT, () => {
    console.info(
      `Server is running on http://localhost:${process.env.PORT}/graphql`
    );
  });
}

main();
