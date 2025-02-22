import { colors } from "@heroui/react";
import type { Config } from "tailwindcss";
const { heroui } = require("@heroui/react");
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    heroui({
      addCommonColors: false,
      themes: {
        dark: {
          colors: {
            primary: colors.cyan,
          },
        },
        light: {
          colors: {
            primary: colors.cyan,
          },
        },
      },
    }),
  ],
} satisfies Config;
