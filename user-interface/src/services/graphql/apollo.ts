import {
  ApolloClient,
  createHttpLink,
  DocumentNode,
  InMemoryCache,
  OperationVariables,
  TypedDocumentNode,
} from "@apollo/client";
const apolloClient = (cookie: string) =>
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

export function mutation(
  grapgqlSchema: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  variables: any,
  cookie: string = ""
) {
  return apolloClient(cookie).mutate({
    mutation: grapgqlSchema,
    variables: variables,
  });
}
export function query(
  cookie: string,
  variables: any,
  grapgqlSchema: DocumentNode | TypedDocumentNode<any, OperationVariables>
) {
  return apolloClient(cookie).watchQuery({
    query: grapgqlSchema,
    variables: variables,
  });
}
