"use client";
import { mutation, query } from "@/services/graphql/apollo";
import { HasPermission, LoginUser } from "@/services/graphql/user.query-doc";
import { consts } from "@/utils/consts";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { ErrorHandler } from "@/services/graphql/graphql-error-handler";
import { IInputLogin } from "@/interfaces/IUser";
import { useForm } from "react-hook-form";
import { Button, Input } from "@heroui/react";
import { createUserPermissionStore } from "@/StorageManagement/userStorage";
//============================================ extra Info =======================================
let loading = false;

//============================================ main function ==========================================
export default function Login() {
  let router = useRouter();
  const { setState } = createUserPermissionStore();
  const { handleSubmit, register } = useForm({
    defaultValues: { userName: "", password: "" },
    reValidateMode: "onBlur",
  });
  function onSubmit(values: IInputLogin) {
    loading = true;
    if (values.userName && values.password) {
      mutation(LoginUser, {
        userName: values.userName,
        password: values.password,
      })
        .then((res) => {
          loading = false;
          onGetSiniorPermission();
          router.push("/");
        })
        .catch((error) => {
          ErrorHandler(error);
        });
    }
  }
  function onGetSiniorPermission() {
    query(HasPermission).then((res) => {
      setState({ hasPermission: res.data.hasPermission });
    });
  }
  return (
    <div className="m-auto">
      <div
        className="w-full flex justify-center text-3xl text-zinc-950 dark:text-zinc-50
         h-[4rem] mt-2 mb-8 border-b-8 border-sky-400 dark:border-sky-500"
      >
        {consts.login.info.title}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-16">
          <Input
            required
            labelPlacement="outside"
            variant="bordered"
            size="lg"
            radius={"lg"}
            {...register("userName", { required: true })}
            label={consts.login.info.userName}
            placeholder={consts.login.placeholder.enterUsername}
          ></Input>
        </div>
        <div className="my-10">
          <Input
            type="password"
            required
            labelPlacement="outside"
            variant="bordered"
            size="lg"
            radius={"lg"}
            {...register("password", { required: true })}
            label={consts.login.info.password}
            placeholder={consts.login.placeholder.enterPassword}
          ></Input>
        </div>
        <Button
          radius={"lg"}
          variant="solid"
          color="primary"
          fullWidth
          size="lg"
          type="submit"
        >
          <div className="absolute left-2">
            {loading ? <Loader2 className="animate-spin" /> : ""}
          </div>
          {consts.login.info.signIn}
        </Button>
      </form>
      <Link href={"/ForgotPassword"}>
        <div className="text-sm text-zinc-700 dark:text-zinc-200 my-2 hover:cursor-pointer hover:underline hover:text-sky-500 hover:dark:text-sky-500">
          {consts.login.info.forgotPassword}
        </div>
      </Link>
      <Link href={"/SignUp"}>
        <div className="text-sm text-zinc-700 dark:text-zinc-200 hover:cursor-pointer hover:underline hover:text-sky-500 hover:dark:text-sky-500">
          {consts.login.info.signUp}
        </div>
      </Link>
    </div>
  );
}
