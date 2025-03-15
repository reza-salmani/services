"use client";
import { mutation, query } from "@/services/graphql/apollo";
import { GetPages, LogoutUser } from "@/services/graphql/user.query-doc";
import { ChevronDown, Loader2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { useCallback, useEffect, useState } from "react";
import { ThemeSwitcher } from "../providers/theme";
import { classNames } from "primereact/utils";

export default function MenuBar() {
  //#region ------------- variables -----------------------
  let router = useRouter();
  let [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  let loading = false;
  //#endregion

  //#region ------------- render function -----------------
  const start = (
    <div className="mr-2">
      <img className="rounded-2xl" width={70} src="/images/Logo.png"></img>
    </div>
  );
  const end = useCallback(() => {
    const onLogout = () => {
      loading = true;
      mutation(LogoutUser, {}).then(() => {
        loading = false;
        router.push("/");
      });
    };
    return (
      <div className="flex align-items-center gap-2">
        <ThemeSwitcher></ThemeSwitcher>
        <Button
          text
          color="primary"
          className="text-cyan-800 dark:text-cyan-400 group-data-[active]:bg-cyan-700 group-data-[active]:text-white dark:group-data-[active]:bg-cyan-200 dark:group-data-[active]:text-black rounded-full"
          onClick={onLogout}
          icon={
            loading ? (
              <Loader2></Loader2>
            ) : (
              <LogOut className="rotate-180"></LogOut>
            )
          }
        ></Button>
      </div>
    );
  }, []);
  //#endregion

  //#region ------------- main functions ------------------
  useEffect(() => {
    query(GetPages).then((res) => {
      let result: IMenuItem[] = [];
      res.data.menu.map((item: IMenuItemQuery) => {
        if (!item.parentId) {
          result.push({ ...item, children: [] });
        } else {
          result.flatMap((resultItem) => {
            if (resultItem.selfId === item.parentId) {
              resultItem.children.push({ ...item, children: [] });
            }
            return resultItem;
          });
        }
      });
      setMenuItems(RecursiveMenuCreator(result));
    });
  }, []);

  const RecursiveMenuCreator = (items: IMenuItem[]) => {
    let result: MenuItem[] = [];
    items.map((item) => {
      if (!item.children || !item.children.length) {
        result.push({
          command: () => {
            router.push(item.link!);
          },
          template: (props, context) => (
            <div
              key={item.id}
              className={classNames(
                "p-menuitem cursor-pointer p-2 rounded-2xl max-w-[20rem]"
              )}
            >
              <div>{item.persianName}</div>
              {item.description ? (
                <div>
                  <span className="text-xs text-slate-400">
                    {item.description}
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
          ),
        });
      } else {
        result.push({
          items: RecursiveMenuCreator(item.children),
          template: () => (
            <div
              key={item.id}
              className={classNames("p-menuitem cursor-pointer flex p-2")}
            >
              {item.persianName}
              <ChevronDown></ChevronDown>
            </div>
          ),
        });
      }
    });
    return result;
  };

  return (
    <div>
      <Menubar model={menuItems} start={start} end={end}></Menubar>
    </div>
  );
  //#endregion
}

//#region --------------- interfaces ----------------------
interface IMenuItemQuery {
  name: string;
  persianName: string;
  id: string;
  description: string;
  selfId: number;
  parentId: number | null;
  link: string | null;
  isReadOnly: boolean;
  roles: string[];
}
interface IMenuItem extends IMenuItemQuery {
  children: IMenuItem[];
}
//#endregion
