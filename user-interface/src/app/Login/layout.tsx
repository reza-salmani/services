import React from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-[70vh] w-full flex">{children}</div>;
}
