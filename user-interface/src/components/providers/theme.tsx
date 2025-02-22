// app/components/ThemeSwitcher.tsx
"use client";

import { consts } from "@/utils/consts";
import { Button, Tooltip } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Tooltip
      content={theme === "dark" ? consts.theme.light : consts.theme.dark}
    >
      <Button
        variant="flat"
        color="primary"
        className="text-cyan-800 dark:text-cyan-400"
        onPress={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
      >
        {theme === "light" ? <Moon></Moon> : <Sun></Sun>}
      </Button>
    </Tooltip>
  );
}
