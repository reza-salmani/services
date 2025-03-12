import type { Metadata } from "next";
import "./globals.css";

import "../../public/style/dark.css";
import "../../public/style/light.css";
import { Providers } from "@/components/providers/providers";
export const metadata: Metadata = {
  title: "نرم افزار جامع اداری مالی سوده ایمن آرام",
  description: "ساخته شده توسط رضا سلمانی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`antialiased base-style`}>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
