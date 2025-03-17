"use client";
import Loader from "@/components/common/Loader";
import { IResponseData } from "@/interfaces/IBase";
import { IUpsertUser, IUser } from "@/interfaces/IUser";
import { mutation, query } from "@/services/graphql/apollo";
import { ErrorHandler } from "@/services/graphql/graphql-error-handler";
import {
  ChangeActivationUser,
  DeleteUser,
  GetAllUser,
  RevertDeleteUser,
} from "@/services/graphql/user.query-doc";
import { createUserPermissionStore } from "@/StorageManagement/userStorage";
import { consts } from "@/utils/consts";
import { dateTools } from "@/utils/date";
import {
  AlertTriangle,
  EditIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  Trash2,
  Undo2,
  UserCog,
} from "lucide-react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { UpsertUser } from "./upsert";
import { classNames } from "primereact/utils";
import { UpdateUserRoles } from "./update-roles";

export default function UsersList() {
  //#region ------------- variables -----------------------
  const [paginationItems, setPaginationItems] = useState<IResponseData<IUser>>({
    items: [],
    pageNumber: 1,
    pageSize: 10,
    totalCount: 1,
  });
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleUpdateRole, setVisibleUpdateRole] = useState(false);
  const [editInfo, setEditInfo] = useState<IUpsertUser | null>(null);
  const [userInfoForUpdateRole, setUserInfoForUpdateRole] = useState<IUser[]>(
    []
  );
  const { getState } = createUserPermissionStore();
  const [selectedRowItem, setSelectedRowItem] = useState<IUser[]>([]);
  const { handleSubmit, register, reset } = useForm<IUpsertUser>({
    defaultValues: {
      nationalCode: "",
      userName: "",
      email: "",
      password: "",
      phone: "",
    },
  });
  const columns = [
    { label: "نام کاربری", key: "userName" },
    { label: "نقش", key: "roles" },
    { label: "کد ملی کاربر", key: "nationalCode" },
    { label: "همراه", key: "phone" },
    { label: "تاریخ ایجاد", key: "createDate" },
    { label: "تاریخ ویرایش", key: "updateDate" },
    { label: "تاریخ حذف", key: "deleteDate" },
    { label: "تاریخ بازگردانی", key: "revertDate" },
    { label: "وضعیت حذف", key: "isDeleted" },
    { label: "وضعیت کاربری", key: "isActive" },
    { label: "عملیات", key: "actions" },
  ];
  //#endregion

  //#region ------------- rendered functions --------------
  const renderCell = useCallback((user: any, column: any) => {
    const cellValue = user["avatar"];

    switch (column.field) {
      case "userName":
        return (
          <div className="flex gap-2">
            <Avatar image={cellValue} size="large" shape="circle" />
            <div className="">
              <div className="font-bold">{user.userName}</div>
              <div className="text-sm text-surface-400">{user.email}</div>
            </div>
          </div>
        );
      case "isActive":
        return (
          <Tag
            rounded
            severity="success"
            value={user[column.field] ? "فعال" : "غیرفعال"}
          ></Tag>
        );
      case "isDeleted":
        return (
          <Tag
            rounded
            severity="danger"
            value={user[column.field] ? "حذف شده" : "موجود"}
          ></Tag>
        );
      case "createDate":
      case "updateDate":
      case "deleteDate":
      case "revertDate":
        return (
          <div>
            {user[column.field]
              ? dateTools.toPersian(user[column.field], "long")
              : ""}
          </div>
        );
      case "actions":
        return user.roles.some((x: string) => x === "Admin") ? (
          ""
        ) : (
          <div className="relative flex items-center gap-4">
            {user.roles.some((x: string) => [
              "Admin",
              "Demo",
              "User_Global",
              "User_Management",
            ]) && user.isActive ? (
              <Button
                tooltip={consts.titles.toggleActivation}
                tooltipOptions={{
                  className: "text-warning-400",
                  position: "bottom",
                }}
                className={classNames([
                  "text-lg cursor-pointer active:opacity-50",
                ])}
                text
                onClick={() => onShowUpdateUserRole([user])}
                icon={<UserCog></UserCog>}
              ></Button>
            ) : (
              ""
            )}
            <Button
              tooltip={consts.titles.toggleActivation}
              tooltipOptions={{
                className: "text-warning-400",
                position: "bottom",
              }}
              className={classNames(
                ["text-lg cursor-pointer active:opacity-50"],
                !user.isActive ? ["text-zinc-500"] : ["text-sky-500"]
              )}
              text
              onClick={() => onSetToggleActivation([user], !user.isActive)}
              icon={!user.isActive ? <ToggleLeftIcon /> : <ToggleRightIcon />}
            ></Button>
            <Button
              tooltip={consts.titles.edit}
              tooltipOptions={{
                className: "text-success-400",
                position: "bottom",
              }}
              onClick={() => showUpsertComponent(user)}
              className="text-lg text-zinc-500 cursor-pointer active:opacity-50"
              text
              icon={<EditIcon />}
            ></Button>
            {user.isDeleted ? (
              getState().hasPermission ? (
                <Button
                  tooltip={consts.titles.revert}
                  tooltipOptions={{
                    className: "text-danger-400",
                    position: "bottom",
                  }}
                  className="text-lg text-zinc-500 cursor-pointer active:opacity-50"
                  onClick={() => onRevertRecords([user])}
                  text
                  icon={<Undo2 />}
                ></Button>
              ) : (
                ""
              )
            ) : (
              <Button
                tooltip={consts.titles.delete}
                tooltipOptions={{
                  className: "text-danger-400",
                  position: "bottom",
                }}
                className="text-lg text-zinc-500 cursor-pointer active:opacity-50"
                onClick={() => onDeleteRecords([user])}
                text
                icon={<Trash2 />}
              ></Button>
            )}
          </div>
        );
      default:
        return <div>{user[column.field]}</div>;
    }
  }, []);

  const headerItems = useCallback(() => {
    function onToggleRecords() {
      confirmDialog({
        header: consts.titles.toggleActivation,
        acceptLabel: consts.titles.yes,
        rejectLabel: consts.titles.no,
        message: (
          <div className="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
            <AlertTriangle></AlertTriangle>
            <span>{consts.messages.toggleMessage}</span>
            <div className="flex gap-2 m-auto mx-4 justify-center">
              <Button
                color="secondary"
                text
                onClick={() => onSetToggleActivation(selectedRowItem, false)}
              >
                {consts.titles.inActive}
              </Button>
              <Button
                color="success"
                text
                onClick={() => onSetToggleActivation(selectedRowItem, true)}
              >
                {consts.titles.active}
              </Button>
            </div>
          </div>
        ),
      });
    }
    return (
      <>
        {selectedRowItem.length !== 0 ? (
          <>
            <div className="w-auto flex gap-8">
              <div className="w-auto my-auto">
                {consts.titles.totalSelectedItem} : {selectedRowItem.length}
              </div>
              <div className="w-auto flex gap-2">
                <Button
                  onClick={() => setCancel()}
                  outlined
                  size="small"
                  className="text-lg w-auto"
                >
                  {consts.titles.cancel}
                </Button>
                <Button
                  onClick={() => onDeleteRecords(selectedRowItem)}
                  severity="danger"
                  size="small"
                  className="text-lg w-auto"
                >
                  {consts.titles.delete}
                </Button>
                <Button
                  onClick={() => onRevertRecords(selectedRowItem)}
                  severity="warning"
                  size="small"
                  className="text-lg w-auto"
                >
                  {consts.titles.revert}
                </Button>
                <Button
                  onClick={() => onToggleRecords()}
                  severity="info"
                  size="small"
                  className="text-lg w-auto"
                >
                  {consts.titles.toggleActivation}
                </Button>
              </div>
            </div>
            <ConfirmDialog />
          </>
        ) : (
          <div className="w-auto">
            <Button
              onClick={() => showUpsertComponent(null)}
              size="small"
              className="text-lg w-auto"
            >
              {consts.titles.create}
            </Button>
          </div>
        )}
      </>
    );
  }, [selectedRowItem]);
  //#endregion

  //#region ------------- main function -------------------
  const getAllDataFunction = async () => {
    return query(GetAllUser, {
      queries: {
        take: paginationItems.pageSize,
        skip:
          paginationItems.pageNumber > 0
            ? (paginationItems.pageNumber - 1) * paginationItems.pageSize
            : 0,
      },
    }).then((res) => {
      setPaginationItems({
        items: res.data.GetAllUsersWithQuery.items,
        pageNumber: res.data.GetAllUsersWithQuery.pageNumber,
        pageSize: res.data.GetAllUsersWithQuery.pageSize,
        totalCount: res.data.GetAllUsersWithQuery.totalCount,
      });
      return res;
    });
  };
  useEffect(() => {
    getAllDataFunction();
  }, []);

  const onChangePagination = async (skip: number) => {
    paginationItems.pageNumber = skip;
    setPaginationItems(paginationItems);
    await getAllDataFunction();
  };
  const setCancel = () => {
    setSelectedRowItem([]);
  };
  const onHideUpsert = () => {
    setVisible(false);
    getAllDataFunction();
  };
  const onHideUpdateRole = () => {
    setVisibleUpdateRole(false);
    getAllDataFunction();
  };
  const onShowUpdateUserRole = (selectedItems: IUser[]) => {
    setUserInfoForUpdateRole(selectedItems);
    setVisibleUpdateRole(true);
  };
  function onSetToggleActivation(selectedItems: IUser[], state: boolean) {
    mutation(ChangeActivationUser, {
      ids: selectedItems.map((x) => x.id),
      state: state,
    })
      .then((res) => {
        getAllDataFunction();
        setSelectedRowItem([]);
      })
      .catch((error) => {
        ErrorHandler(error);
      });
  }
  function onDeleteRecords(selectedItems: IUser[]) {
    confirmDialog({
      header: consts.titles.delete,
      acceptLabel: consts.titles.yes,
      rejectLabel: consts.titles.no,
      message: (
        <div className="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
          <AlertTriangle></AlertTriangle>
          <span>{consts.questions.delete}</span>
        </div>
      ),
      accept: () => {
        mutation(DeleteUser, { ids: selectedItems.map((x) => x.id) })
          .then((res) => {
            getAllDataFunction();
            setSelectedRowItem([]);
          })
          .catch((error) => {
            ErrorHandler(error);
          });
      },
    });
  }
  function onRevertRecords(selectedItems: IUser[]) {
    confirmDialog({
      header: consts.titles.revert,
      acceptLabel: consts.titles.yes,
      rejectLabel: consts.titles.no,
      message: (
        <div className="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
          <AlertTriangle></AlertTriangle>
          <span>{consts.questions.revert}</span>
        </div>
      ),
      accept: () => {
        mutation(RevertDeleteUser, { ids: selectedItems.map((x) => x.id) })
          .then((res) => {
            getAllDataFunction();
            setSelectedRowItem([]);
          })
          .catch((error) => {
            ErrorHandler(error);
          });
      },
    });
  }
  const showUpsertComponent = (user: IUpsertUser | null) => {
    setEditInfo(user);
    setVisible(true);
  };
  return (
    <div
      className="bg-slate-100 relative dark:bg-slate-950 p-4 rounded-2xl"
      style={{ height: "calc(100vh - 8rem)" }}
    >
      <Loader loading={loading}>
        <DataTable
          header={headerItems}
          dataKey={"id"}
          paginator
          rows={10}
          selectionMode="checkbox"
          selection={selectedRowItem}
          onSelectionChange={(e) => setSelectedRowItem(e.value)}
          rowsPerPageOptions={[5, 10, 25, 50]}
          paginatorClassName="flex justify-center"
          stripedRows
          value={paginationItems.items}
          totalRecords={paginationItems.totalCount}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          {columns.map((col, i) => (
            <Column
              key={col.key}
              field={col.key}
              body={renderCell}
              header={col.label}
            />
          ))}
        </DataTable>
      </Loader>
      <UpsertUser
        visible={visible}
        setVisible={(event) => onHideUpsert()}
        editInfo={editInfo}
      ></UpsertUser>
      <UpdateUserRoles
        visible={visibleUpdateRole}
        setVisible={() => onHideUpdateRole()}
        userInfo={userInfoForUpdateRole}
      ></UpdateUserRoles>
    </div>
  );
  //#endregion
}
