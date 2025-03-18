"use client";
import { mutation, query } from "@/services/graphql/apollo";
import {
  GetPages,
  GetUserInfo,
  LogoutUser,
} from "@/services/graphql/user.query-doc";
import { ChevronDown, Loader2, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { useCallback, useEffect, useRef, useState } from "react";
import { classNames } from "primereact/utils";
import { OverlayPanel } from "primereact/overlaypanel";
import { ThemeSwitcher } from "../providers/theme";
import { IUser } from "@/interfaces/IUser";
import { consts } from "@/utils/consts";
import { Avatar } from "primereact/avatar";
import { IMenuItem, IMenuItemQuery } from "@/interfaces/IBase";

export default function MenuBar() {
  //#region ------------- variables -----------------------
  let router = useRouter();
  let [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  let [userInfo, setUserInfo] = useState<IUser | null>(null);
  const profileRef = useRef<OverlayPanel>(null);
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
      <>
        <Button
          type="button"
          icon={<Menu></Menu>}
          text
          onClick={(e) => profileRef.current!.toggle(e)}
        />
        <OverlayPanel className="w-[15rem]" ref={profileRef}>
          <div className="flex">
            <div>
              <Avatar
                size="xlarge"
                shape="circle"
                image={userInfo?.avatar}
              ></Avatar>
            </div>
            <div className="mr-4 my-auto">
              <div>{consts.titles.userName}:</div>
              <div className="text-sky-400 font-bold">{userInfo?.userName}</div>
            </div>
          </div>
          <div className="flex justify-around">
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
        </OverlayPanel>
      </>
    );
  }, [userInfo]);
  //#endregion

  //#region ------------- main functions ------------------
  useEffect(() => {
    getPages();
    getUserInfo();
  }, []);
  const getPages = async () => {
    const response = await query(GetPages);
    let result: IMenuItem[] = [];
    response.data.menu.map((item: IMenuItemQuery) => {
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
  };
  const getUserInfo = async () => {
    setUserInfo((await query(GetUserInfo)).data.getUserInfo);
  };
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
