"use client";
import { IForgotPassword } from "@/interfaces/IUser";
import { mutation } from "@/services/graphql/apollo";
import { ForgotPasswordUser } from "@/services/graphql/user.query-doc";
import { consts } from "@/utils/consts";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import { forgotPassword } from "./zod-schema";

export default function ForgotPassword() {
  //#region ------------- variables -----------------------
  let loading = false;
  let router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IForgotPassword>({
    resolver: zodResolver(forgotPassword),
  });
  //#endregion

  //#region ------------- main functions ------------------
  const onReset = (values: IForgotPassword) => {
    loading = true;
    mutation(ForgotPasswordUser, {
      userName: values.userName,
      password: values.newPassword,
    }).then(() => {
      loading = false;
      router.push("/");
    });
  };
  return (
    <div className="m-auto">
      <div
        className="w-full flex justify-center text-3xl text-zinc-950 dark:text-zinc-50
         h-[4rem] mt-2 mb-8 border-b-8 border-sky-400 dark:border-sky-500"
      >
        {consts.titles.forgotPasswordTitle}
      </div>
      <form onSubmit={handleSubmit(onReset)}>
        <div className="my-4">
          <div>
            <label htmlFor="userName">{consts.titles.userName}</label>
          </div>
          <Controller
            name="userName"
            control={control}
            render={({ field }) => (
              <InputText
                className="w-full p-2"
                id="userName"
                {...field}
                placeholder={consts.placeholders.enterUserName}
              ></InputText>
            )}
          />
          {errors.userName && (
            <span className="error-message-style">
              {errors.userName.message}
            </span>
          )}
        </div>
        <div className="my-8">
          <div>
            <label htmlFor="newPassword">{consts.titles.password}</label>
          </div>
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <InputText
                className="w-full p-2"
                id="newPassword"
                {...field}
                placeholder={consts.placeholders.enterPassword}
              ></InputText>
            )}
          />
          {errors.newPassword && (
            <span className="error-message-style">
              {errors.newPassword.message}
            </span>
          )}
        </div>
        <Button className="w-full" type="submit" loading={loading}>
          <label className="text-lg flex justify-center m-auto cursor-pointer">
            {consts.titles.reset}
          </label>
        </Button>
      </form>
      <Link href={"/Login"}>
        <div className="text-sm text-zinc-700 dark:text-zinc-200 my-2 hover:cursor-pointer hover:underline hover:text-sky-500 hover:dark:text-sky-500">
          {consts.titles.returnToLogin}
        </div>
      </Link>
    </div>
  );
  //#endregion
}
