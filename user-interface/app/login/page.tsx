"use client";
import { Consts } from "@/config/consts";
import { Button, Divider, Form, Input, Link } from "@nextui-org/react";
import { useState } from "react";
export default function Login() {
  const [loginInfo, setLoginInfo] = useState({ userName: "", password: "" });
  const login = () => {
    console.log();
  };
  return (
    <div className="h-screen grid justify-center lg:justify-start lg:mr-[35vh] align-middle w-full">
      <div className="m-auto h-auto w-[25rem] rounded-xl border-2 border-teal-700 bg-transparent backdrop-blur-lg p-4">
        <div className="font-bold text-2xl text-center m-auto">ورود</div>
        <div className="my-4 mb-8">
          <Divider />
        </div>
        <Form
          className="w-full"
          validationBehavior="native"
          onSubmit={() => login}
        >
          <div className="my-2 w-full">
            <Input
              isRequired
              errorMessage={Consts.login.required.userName}
              radius="md"
              label={Consts.login.userName}
              type="text"
            />
          </div>
          <div className="my-2 w-full">
            <Input
              isRequired
              radius="md"
              label={Consts.login.password}
              errorMessage={Consts.login.required.password}
              type="password"
            />
          </div>
          <Button
            color="primary"
            className="w-full text-xl my-4"
            variant="shadow"
            type="submit"
          >
            ورود
          </Button>
          <div className="w-full px-2 flex justify-between">
            <Link
              href="/submit"
              className="w-auto"
              size="lg"
              underline="hover"
              color="foreground"
            >
              {Consts.submit.title}
            </Link>
            <Link
              href="/forgot-password"
              className="w-auto"
              size="lg"
              underline="hover"
              color="foreground"
            >
              {Consts.forgotPassword.title}
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
