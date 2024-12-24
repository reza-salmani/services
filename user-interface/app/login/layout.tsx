import { ThemeSwitch } from "@/components/theme-switch";
import React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto p-0 flex justify-center h-screen w-screen">
      <ThemeSwitch />
      {children}
    </div>
  );
}
