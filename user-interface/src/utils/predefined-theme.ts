import { APIOptions } from "primereact/api";

export const preDefinedTheme: APIOptions = {
  inputStyle: "filled",
  ripple: true,
  pt: {
    button: {
      root: {
        className:
          "[&:not(.p-button-text):not(.p-button-outlined):not(.p-button-warning):not(.p-button-Secondary):not(.p-button-info):not(.p-button-success):not(.p-button-help):not(.p-button-danger)]:bg-blue-400 hover:[&:not(.p-button-text):not(.p-button-outlined):not(.p-button-warning):not(.p-button-Secondary):not(.p-button-info):not(.p-button-success):not(.p-button-help):not(.p-button-danger)]:bg-blue-500",
      },
    },
    inputtext: {
      root: {
        className:
          "bg-transparent placeholder:text-sm placeholder:text-gray-500",
      },
    },
    datatable: {
      column: {
        headerCell: { className: "text-start" },
        bodyCell: { className: "text-start" },
        headerCheckbox: { box: { className: "rounded-sm" } },
        rowCheckbox: { box: { className: "rounded-sm" } },
      },
      paginator: {
        firstPageIcon: {
          className: "rotate-180",
        },
        lastPageIcon: {
          className: "rotate-180",
        },
        nextPageIcon: {
          className: "rotate-180",
        },
        prevPageIcon: {
          className: "rotate-180",
        },
        RPPDropdown: {
          input: { className: "px-2 py-3" },
        },
      },
    },
    menubar: {
      root: {
        className:
          "m-auto h-auto w-full opacity-[97%] p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl relative z-[200]",
      },
      action: { className: "rounded-2xl" },
      button: { className: "rounded-2xl" },
      content: {
        className:
          "rounded-2xl bg-slate-200 dark:bg-slate-800 m-2 hover:bg-slate-300 dark:hover:bg-slate-700",
      },
      menuitem: { className: "rounded-2xl" },
      menu: { className: "w-full rounded-2xl justify-center m-auto" },
      start: { className: "ml-2" },

      submenu: {
        className:
          "opacity-[97%] bg-slate-50 dark:bg-slate-900 rounded-2xl p-1 min-w-max",
      },
    },
  },
};
