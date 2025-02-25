"use client";
import { IUser } from "@/interfaces/IUser";
import { query } from "@/services/graphql/apollo";
import { GetAllUser } from "@/services/graphql/user.query-doc";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { useEffect, useState } from "react";

export default function UsersList() {
  //#region ------------ variables --------------------------
  const [rows, setRows] = useState<IUser[]>([]);
  const columns = [
    { label: "نام", key: "firstName" },
    { label: "نام خانوادگی", key: "lastName" },
    { label: "نام کاربری", key: "userName" },
    { label: "ایمیل", key: "email" },
    { label: "همراه", key: "phone" },
    { label: "تاریخ ایجاد", key: "createDate" },
    { label: "تاریخ ویرایش", key: "updateDate" },
    { label: "تاریخ حذف", key: "deleteDate" },
    { label: "تاریخ بازگردانی", key: "revertDate" },
    { label: "وضعیت حذف", key: "isDeleted" },
    { label: "وضعیت کاربری", key: "isActive" },
  ];
  //#endregion

  //#region ------------------ functions -------------------------
  useEffect(() => {
    query(GetAllUser, { take: 10, skip: 0 }).then((res) => {
      console.log(res.data.GetAllUsersWithQuery as IUser[]);

      setRows(res.data.GetAllUsersWithQuery as IUser[]);
    });
  }, []);
  //#endregion

  //#region -------------------------------- html section ----------
  return (
    <div
      className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl"
      style={{ height: "calc(100vh - 8rem)" }}
    >
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {" "}
                  {columnKey === "isActive"
                    ? getKeyValue(item, columnKey)
                      ? "فعال"
                      : "غیرفعال"
                    : columnKey === "isDeleted"
                    ? getKeyValue(item, columnKey)
                      ? "حذف شده"
                      : "حذف نشده"
                    : getKeyValue(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
  //#endregion
}
