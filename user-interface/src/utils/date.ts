export const dateTools = {
  toPersian: (
    date: string,
    dateStyle: "full" | "long" | "medium" | "short" = "full"
  ) => {
    return new Date(date).toLocaleDateString("fa-IR", { dateStyle: dateStyle });
  },
};
