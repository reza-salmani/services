import { mutation } from "@/services/graphql/apollo";
import { IsAuth } from "@/services/graphql/user.query-doc";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

//===================================== main function =====================================
export default async function Home() {
  let isAuth = (
    await mutation(IsAuth, {}, (await cookies()).get("jwt")?.value!)
  ).data.isAuth;

  return !isAuth ? redirect("/Login") : redirect("/Shell");
}
