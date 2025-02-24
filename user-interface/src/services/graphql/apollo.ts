import {
  ApolloClient,
  createHttpLink,
  DocumentNode,
  InMemoryCache,
  OperationVariables,
  TypedDocumentNode,
} from "@apollo/client";

//============================ main function ==========================
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

//============================ exported functions ===============================
export async function mutation(
  grapgqlSchema: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  variables: any,
  cookie: string = ""
) {
  return await apolloClient(cookie).mutate({
    mutation: grapgqlSchema,
    variables: variables,
  });
}

export async function query(
  grapgqlSchema: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  variables?: any,
  cookie: string = ""
) {
  return await apolloClient(cookie).query({
    query: grapgqlSchema,
    variables: variables,
  });
}
