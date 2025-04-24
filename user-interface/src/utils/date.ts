export const dateTools = {
  toPersian: (
    date: string,
    dateStyle: "full" | "long" | "medium" | "short" = "full"
  ) => {
    return new Date(date).toLocaleDateString("fa-IR", { dateStyle: dateStyle });
  },
  formatDate: (
    date: string,
    dateStyle: "full" | "long" | "medium" | "short" = "full"
  ) => {
    return new Date(date).toLocaleDateString("en-US", { dateStyle: dateStyle });
  },
};
