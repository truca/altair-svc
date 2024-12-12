//src/lib/apollo-wrapper.ts
"use client";

import { ApolloLink, HttpLink } from "@apollo/client";
import {
  InMemoryCache,
  SSRMultipartLink,
  ApolloNextAppProvider,
  ApolloClient,
} from "@apollo/experimental-nextjs-app-support";

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.GRAPHQL_ENDPOINT ?? "http://localhost:4000/graphql",
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : ApolloLink.from([httpLink]),
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
