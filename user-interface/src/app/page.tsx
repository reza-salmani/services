import { ModeToggle } from "@/components/common/DarkModeToggler";
import LoginLayout from "./Login/layout";
import Login from "./Login/page";
import { apolloClient } from "@/services/graphql/apollo";
import { IsAuth } from "@/services/graphql/user.query-doc";
import { cookies } from "next/headers";
export default async function Home() {
  let isAuth = await apolloClient((await cookies()).get("jwt")?.value!).mutate({
    mutation: IsAuth,
  });
  if (!isAuth.data.isAuth) {
    return (
      <LoginLayout>
        <Login></Login>
      </LoginLayout>
    );
  } else {
    return (
      <div className="p-4">
        <ModeToggle></ModeToggle>
      </div>
    );
  }
}
