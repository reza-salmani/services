"use client";
import { apolloClient } from "@/services/graphql/apollo";
import { LoginUser } from "@/services/graphql/user.query-doc";
let result = (userName: string, password: string) =>
  apolloClient().mutate({
    mutation: LoginUser,
    variables: { userName: userName, password: password },
  });
export default function Login() {
  // result("admin", "admin@r.R").then((res) => {
  //   console.log(res.data);
  // });
  return <div className="m-auto">this is login</div>;
}
