// app/components/ThemeSwitcher.tsx
"use client";

import { consts } from "@/utils/consts";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    setTheme(
      !theme
        ? window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : theme
    );
  }, []);

  if (!mounted) return null;

  return (
    <Button
      tooltip={theme === "dark" ? consts.titles.light : consts.titles.dark}
      tooltipOptions={{ position: "left", appendTo: "self" }}
      text
      className="text-cyan-800 dark:text-cyan-400 rounded-full"
      onClick={() => {
        setTheme(theme === "light" ? "dark" : "light");
      }}
      icon={theme === "light" ? <Moon></Moon> : <Sun></Sun>}
    ></Button>
  );
}
