import React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100vh] w-[100vw] flex">
      <div className="m-auto mt-[10%] bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl h-auto w-[25rem]">
        {children}
      </div>
    </div>
  );
}
