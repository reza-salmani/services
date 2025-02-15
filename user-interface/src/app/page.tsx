import { ModeToggle } from "@/components/common/DarkModeToggler";
import LoginLayout from "./Login/layout";
import Login from "./Login/page";
export default async function Home() {
  // let isAuth = await apolloClient((await cookies()).get("jwt")?.value!).mutate({
  //   mutation: IsAuth,
  // });
  if (false) {
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
