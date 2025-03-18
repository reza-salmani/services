"use client";
import Loader from "@/components/common/Loader";
import { IMenuItem } from "@/interfaces/IBase";
import { query } from "@/services/graphql/apollo";
import { GetPages, GetRoles } from "@/services/graphql/user.query-doc";
import { consts } from "@/utils/consts";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";

export default function UserClassification() {
  //#region ------------- variables -----------------------
  let [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  let [roles, setRoles] = useState<string[]>([]);
  let [loading, setLoading] = useState<boolean>(false);
  let toast = useRef<Toast>(null);
  //#endregion

  //#region ------------- functions -----------------------
  useEffect(() => {
    onGetMenu();
    onGetRoles();
  }, []);
  const onGetMenu = async () => {
    let menuResult = await query(GetPages);
    setMenuItems(menuResult.data.menu);
  };
  const onGetRoles = async () => {
    let roleResult = await query(GetRoles);
    setRoles(roleResult.data.roles);
  };
  const onChange = (menu: IMenuItem, value: string) => {};
  const onCancel = () => {
    onGetMenu();
  };
  //#endregion
  return (
    <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl overflow-y-auto h-[calc(100vh-8rem)]">
      <Toast onHide={() => onCancel()} ref={toast}></Toast>
      <Loader loading={loading}>
        {menuItems.map((menu: IMenuItem) => (
          <div className="my-2" key={`p_${menu.id}`}>
            <Card title={menu.persianName} className="w-full">
              <div className="mb-2">
                <label>{consts.titles.description} : </label>
                <span className="text-gray-500 text-md">
                  {menu.description ?? "ندارد"}
                </span>
              </div>
              <label>{consts.titles.roles} : </label>
              <div className="grid grid-cols-12 gap-x-8 gap-y-2">
                {roles.map((role, index) => (
                  <div
                    key={`s_${index}`}
                    className="col-span-3 flex justify-between "
                  >
                    <label className="text-gray-500 text-md">{role}</label>
                    <Checkbox
                      className=""
                      inputId={menu.id}
                      name="roles"
                      value={role}
                      checked={menu.roles.some(
                        (existRole) => existRole === role
                      )}
                      onChange={(e) => onChange(menu, e.value)}
                    ></Checkbox>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ))}
      </Loader>
    </div>
  );
}
