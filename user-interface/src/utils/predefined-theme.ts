import { APIOptions } from "primereact/api";
import { DomHandler } from "primereact/utils";

export const preDefinedTheme: APIOptions = {
  inputStyle: "filled",
  appendTo: DomHandler.getTargetElement("body"),
  ripple: true,
  pt: {
    button: {
      root: {
        className:
          "[&:not(.p-button-text):not(.p-button-outlined):not(.p-button-warning):not(.p-button-Secondary):not(.p-button-info):not(.p-button-success):not(.p-button-help):not(.p-button-danger)]:bg-blue-400 hover:[&:not(.p-button-text):not(.p-button-outlined):not(.p-button-warning):not(.p-button-Secondary):not(.p-button-info):not(.p-button-success):not(.p-button-help):not(.p-button-danger)]:bg-blue-500",
      },
    },
    card: {
      root: { className: "rounded-2xl" },
      title: {
        className: "text-lg bg-gray-200 dark:bg-gray-800 rounded-2xl p-2",
      },
    },
    inputtext: {
      root: {
        className:
          "bg-transparent placeholder:text-sm placeholder:text-gray-500 p-inputtext-sm",
      },
    },
    toast: {
      icon: {
        className: "ml-5",
      },
    },
    overlaypanel: {
      root: {
        className: "rounded-2xl",
      },
    },
    divider: {
      root: {
        className: "border border-gray-300 dark:border-gray-700",
      },
    },
    dialog: {
      root: {
        draggable: true,
      },
    },
    multiselect: {
      root: {
        className: "rounded-2xl",
      },
      header: {
        className: "rounded-t-2xl",
      },
      panel: {
        className: "rounded-2xl p-4",
      },
      checkbox: {
        box: {
          className: "rounded-sm",
        },
        root: {
          className: "m-auto",
        },
      },
      checkboxContainer: {
        className: "flex",
      },
      item: {
        className: "flex gap-2 my-2 rounded-2xl",
      },
      headerCheckbox: {
        box: {
          className: "rounded-sm",
        },
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
    treeselect: {
      tree: {
        togglerIcon: { className: "rotate-180" },
        content: { className: "rounded-2xl flex gap-2 my-2" },
        node: {
          className: "w-full",
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
