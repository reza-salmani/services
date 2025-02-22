"use client";
import { IForgotPassword } from "@/interfaces/IUser";
import { mutation } from "@/services/graphql/apollo";
import { ForgotPasswordUser } from "@/services/graphql/user.query-doc";
import { consts } from "@/utils/consts";
import { Button, Input } from "@heroui/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

//=================================== extra info ==================================
let loading = false;
//=================================== main function ===============================
export default function ForgotPassword() {
  let router = useRouter();
  const { handleSubmit, register } = useForm<IForgotPassword>({
    defaultValues: {
      userName: "",
      newPassword: "",
    },
  });
  function onReset(values: IForgotPassword) {
    loading = true;
    mutation(ForgotPasswordUser, {
      userName: values.userName,
      password: values.newPassword,
    }).then(() => {
      loading = false;
      router.push("/");
    });
  }
  return (
    <div className="m-auto">
      <div
        className="w-full flex justify-center text-3xl text-zinc-950 dark:text-zinc-50
         h-[4rem] mt-2 mb-8 border-b-8 border-sky-400 dark:border-sky-500"
      >
        {consts.forgotPassword.info.title}
      </div>
      <form onSubmit={handleSubmit(onReset)}>
        <div className="my-16">
          <Input
            required
            labelPlacement="outside"
            variant="bordered"
            size="lg"
            radius={"lg"}
            {...register("userName", { required: true })}
            label={consts.forgotPassword.info.userName}
            placeholder={consts.forgotPassword.placeholder.enterUsername}
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
            {...register("newPassword", { required: true })}
            label={consts.forgotPassword.info.password}
            placeholder={consts.forgotPassword.placeholder.enterPassword}
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
          {consts.forgotPassword.info.reset}
        </Button>
      </form>
      <Link href={"/Login"}>
        <div className="text-sm text-zinc-700 dark:text-zinc-200 my-2 hover:cursor-pointer hover:underline hover:text-sky-500 hover:dark:text-sky-500">
          {consts.forgotPassword.info.returnToLogin}
        </div>
      </Link>
    </div>
  );
}
