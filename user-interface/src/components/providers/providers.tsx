"use client";

import { preDefinedTheme } from "@/utils/predefined-theme";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { PrimeReactProvider } from "primereact/api";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrimeReactProvider value={preDefinedTheme}>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        {children}
      </NextThemesProvider>
    </PrimeReactProvider>
  );
}
