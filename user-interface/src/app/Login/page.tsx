"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { mutation } from "@/services/graphql/apollo";
import { LoginUser } from "@/services/graphql/user.query-doc";
import { consts } from "@/utils/consts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
const formSchema = z.object({
  username: z
    .string({ message: consts.login.errors.requiredUsername })
    .nonempty({ message: consts.login.errors.requiredUsername })
    .regex(/^[A-Za-z0-9]*$/, { message: consts.login.errors.regexUserName }),
  password: z.string({ message: consts.login.errors.requiredPassword }),
});
export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.username && values.password) {
      mutation(LoginUser, {
        userName: values.username,
        password: values.password,
      }).then((res) => {
        console.log(res.data);
      });
    }
  }
  // result("admin", "admin@r.R").then((res) => {
  //   console.log(res.data);
  // });
  return (
    <div className="m-auto">
      <Form {...form}>
        <Label
          className="w-full flex justify-center text-4xl text-zinc-950 dark:text-zinc-50
         h-[4rem] mt-2 mb-8 border-b-8 border-sky-400 dark:border-sky-500"
        >
          {consts.login.info.title}
        </Label>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-700 dark:text-zinc-200 text-lg">
                  {consts.login.info.userName}
                </FormLabel>
                <FormControl>
                  <Input
                    className="border border-sky-400 dark:border-sky-500 h-[3rem]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-700 dark:text-zinc-200 text-lg">
                  {consts.login.info.password}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border border-sky-400 dark:border-sky-500 h-[3rem]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-sky-400 dark:bg-sky-500 hover:bg-sky-500 dark:hover:bg-sky-600 text-2xl h-[3rem] text-white"
            variant={"default"}
          >
            {consts.login.info.loginBtn}
          </Button>
        </form>
      </Form>
    </div>
  );
}
