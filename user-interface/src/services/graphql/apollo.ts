import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  DocumentNode,
  InMemoryCache,
  OperationVariables,
  TypedDocumentNode,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { redirect } from "next/navigation";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
//============================ main function ==========================
const apolloClient = (cookie: string, isUpload: boolean) => {
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path, extensions }) => {
        if (extensions?.statusCode === 401) {
          redirect("/Login");
        }
        if (extensions?.statusCode === 500) {
          redirect("/ServerNotRunning");
        }
      });
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });
  let httpLink = createHttpLink({
    uri: process.env["NEXT_PUBLIC_GATE_WAY_URI"],
    credentials: "include",
    headers: {
      cookie: `jwt=${cookie}`,
    },
    fetchOptions: { cache: "no-store", mode: "cors" },
  });
  if (isUpload) {
    return new ApolloClient({
      link: createUploadLink({
        uri: process.env["NEXT_PUBLIC_GATE_WAY_URI"],
        credentials: "include",
        headers: {
          cookie: `jwt=${cookie}`,
          "content-type": "multipart/form-data",
          "apollo-require-preflight": "true",
        },
        fetchOptions: { cache: "no-store", mode: "cors" },
      }),
      ssrMode: typeof window === "undefined",
      queryDeduplication: false,
      cache: new InMemoryCache(),
    });
  } else
    return new ApolloClient({
      link: ApolloLink.from([errorLink, httpLink]),
      ssrMode: typeof window === "undefined",
      queryDeduplication: false,
      cache: new InMemoryCache(),
    });
};
//============================ exported functions ===============================
export async function mutation<T>(
  graphqlSchema: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  variables: T,
  cookie: string = ""
) {
  return await apolloClient(cookie, false).mutate({
    mutation: graphqlSchema,
    variables: variables as OperationVariables,
  });
}

export async function query<T>(
  graphqlSchema: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  variables?: T,
  cookie: string = ""
) {
  return await apolloClient(cookie, false).query({
    query: graphqlSchema,
    variables: variables as OperationVariables,
  });
}
export async function upload<T>(
  graphqlSchema: DocumentNode | TypedDocumentNode<any, OperationVariables>,
  variables?: T,
  cookie: string = ""
) {
  return await apolloClient(cookie, true).mutate({
    mutation: graphqlSchema,
    variables: variables as OperationVariables,
  });
}
