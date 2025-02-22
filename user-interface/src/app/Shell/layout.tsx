import MenuBar from "@/components/common/MenuBar";
import React from "react";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-4">
      <MenuBar></MenuBar>
      <div className="m-auto  h-auto w-full mt-4 opacity-95">{children}</div>
    </div>
  );
}
