"use client";
import { mutation, query } from "@/services/graphql/apollo";
import { HasPermission, LoginUser } from "@/services/graphql/user.query-doc";
import { consts } from "@/utils/consts";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ErrorHandler } from "@/services/graphql/graphql-error-handler";
import { IInputLogin } from "@/interfaces/IUser";
import { Controller, useForm } from "react-hook-form";
import { createUserPermissionStore } from "@/StorageManagement/userStorage";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { ThemeSwitcher } from "@/components/providers/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { classNames } from "primereact/utils";
import { loginSchema } from "./zod-schema";

export default function Login() {
  //#region -------------- variables -----------------------
  let loading = false;
  let router = useRouter();
  const { setState } = createUserPermissionStore();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  //#endregion

  //#region ------------- main functions ------------------
  const onSubmit = (values: IInputLogin) => {
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
  };
  const onGetSiniorPermission = () => {
    query(HasPermission).then((res) => {
      setState({ hasPermission: res.data.hasPermission });
    });
  };
  return (
    <div className="m-auto">
      <ThemeSwitcher></ThemeSwitcher>
      <div
        className="w-full flex justify-center text-3xl text-zinc-950 dark:text-zinc-50
       h-[4rem] mt-2 mb-8 border-b-8 border-sky-400 dark:border-sky-500"
      >
        {consts.titles.loginTitle}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-4">
          <div>
            <label htmlFor="userName">{consts.titles.userName}</label>
          </div>
          <Controller
            name="userName"
            control={control}
            render={({ field }) => (
              <InputText
                className={classNames(
                  "w-full p-2",
                  errors.userName ? "p-invalid" : ""
                )}
                {...field}
                id="userName"
                placeholder={consts.placeholders.enterUserName}
              ></InputText>
            )}
          />
          {errors.userName && (
            <span className="text-sm text-red-500">
              {errors.userName.message}
            </span>
          )}
        </div>
        <div className="my-8">
          <div>
            <label htmlFor="password">{consts.titles.password}</label>
          </div>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Password
                className="w-full"
                inputClassName="w-full p-2"
                id="password"
                {...field}
                placeholder={consts.placeholders.enterPassword}
              ></Password>
            )}
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>
        <Button className="w-full" type="submit" loading={loading}>
          <label className="flex justify-center m-auto text-lg cursor-pointer">
            {consts.titles.signIn}
          </label>
        </Button>
      </form>
      <Link href={"/ForgotPassword"}>
        <div className="text-sm text-zinc-700 dark:text-zinc-200 my-2 hover:cursor-pointer hover:underline hover:text-sky-500 hover:dark:text-sky-500">
          {consts.titles.forgotPassword}
        </div>
      </Link>
      <Link href={"/SignUp"}>
        <div className="text-sm text-zinc-700 dark:text-zinc-200 hover:cursor-pointer hover:underline hover:text-sky-500 hover:dark:text-sky-500">
          {consts.titles.signUp}
        </div>
      </Link>
    </div>
  );
  //#endregion
}
