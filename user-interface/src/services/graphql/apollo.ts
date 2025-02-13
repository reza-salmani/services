import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

export const apolloClient = (cookie: string = "") =>
  new ApolloClient({
    link: createHttpLink({
      uri: process.env["NEXT_PUBLIC_GATE_WAY_URI"],
      credentials: "include",
      headers: {
        cookie: `jwt=${cookie}`,
      },
      fetchOptions: { cache: "no-store", mode: "cors" },
    }),
    ssrMode: typeof window === "undefined",
    cache: new InMemoryCache(),
  });
