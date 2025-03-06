"use client";

import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import React from "react";
const client = new ApolloClient({
  link: createHttpLink({
    uri: process.env["NEXT_PUBLIC_GATE_WAY_URI"],
    credentials: "include",
    fetchOptions: { cache: "no-store", mode: "cors" },
  }),
  ssrMode: typeof window === "undefined",
  cache: new InMemoryCache(),
});
export default function GraphqlProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
