"use client";
import Loader from "@/components/common/Loader";
import { IResponseData } from "@/interfaces/IBase";
import { ISubmitUser, IUser } from "@/interfaces/IUser";
import { mutation, query } from "@/services/graphql/apollo";
import { ErrorHandler } from "@/services/graphql/graphql-error-handler";
import {
  ChangeActivationUser,
  CreateUserItem,
  DeleteUser,
  GetAllUser,
  RevertDeleteUser,
} from "@/services/graphql/user.query-doc";
import { createUserPermissionStore } from "@/StorageManagement/userStorage";
import { consts } from "@/utils/consts";
import { dateTools } from "@/utils/date";
import { AlertTriangle } from "lucide-react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function UsersList() {
  //#region ------------- variables -----------------------
  const [paginationItems, setPaginationItems] = useState<IResponseData<IUser>>({
    items: [],
    pageNumber: 1,
    pageSize: 10,
    totalCount: 1,
  });
  const [userUpsertTitle, setUserUpsertTitle] = useState("ایجاد کاربر");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const { getState } = createUserPermissionStore();
  const [selectedRowItem, setSelectedRowItem] = useState<IUser[]>([]);
  const { handleSubmit, register, reset } = useForm<ISubmitUser>({
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

  //#region ------------- functions -----------------------
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

  function showModalFn() {
    setUserUpsertTitle("ایجاد کاربر");
  }
  async function onSubmit(values: ISubmitUser) {
    setLoading(true);
    mutation<ISubmitUser>(CreateUserItem, {
      email: values.email,
      nationalCode: values.nationalCode,
      password: values.password,
      phone: values.phone,
      userName: values.userName,
    })
      .then(() => {
        setLoading(false);
        reset();
        getAllDataFunction();
      })
      .catch((error) => {
        ErrorHandler(error);
      });
  }
  async function onChangePagination(skip: number) {
    paginationItems.pageNumber = skip;
    setPaginationItems(paginationItems);
    await getAllDataFunction();
  }
  function setCancel() {
    setSelectedRowItem([]);
  }
  //#endregion

  //#region ------------- rendered Function ---------------
  const renderCell = useCallback((user: any, column: any) => {
    const cellValue = user["avatar"];
    switch (column.field) {
      case "userName":
        return (
          <div className="flex gap-2">
            <Avatar image={cellValue} size="large" shape="circle" />
            <div className="">
              <div className="font-bold">{user.userName}</div>
              <div className="text-md text-surface-400">{user.email}</div>
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
            {/* <Tooltip color="warning" content={consts.global.toggleActivation}>
              <span
                className={clsx(
                  ["text-lg cursor-pointer active:opacity-50"],
                  !user.isActive ? ["text-zinc-500"] : ["text-sky-500"]
                )}
                onClick={() => onSetToggleActivation(user, !user.isActive)}
              >
                {!user.isActive ? <ToggleLeftIcon /> : <ToggleRightIcon />}
              </span>
            </Tooltip>
            <Tooltip color="secondary" content={consts.global.show}>
              <span className="text-lg text-zinc-500 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip color="success" content={consts.global.edit}>
              <span className="text-lg text-zinc-500 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            {user.isDeleted ? (
              getState().hasPermission ? (
                <Tooltip color="default" content={consts.global.revert}>
                  <span
                    className="text-lg text-zinc-500 cursor-pointer active:opacity-50"
                    onClick={() => manageDeleteAndRevert(user, "revert")}
                  >
                    <Undo2 />
                  </span>
                </Tooltip>
              ) : (
                ""
              )
            ) : (
              <Tooltip color="danger" content={consts.global.delete}>
                <span
                  className="text-lg text-zinc-500 cursor-pointer active:opacity-50"
                  onClick={() => manageDeleteAndRevert(user, "delete")}
                >
                  <Trash2 />
                </span>
              </Tooltip>
            )} */}
          </div>
        );
      default:
        return <div>{user[column.field]}</div>;
    }
  }, []);

  const headerItems = useCallback(() => {
    function onDeleteRecords() {
      confirmDialog({
        header: consts.global.delete,
        acceptLabel: consts.global.yes,
        rejectLabel: consts.global.no,
        message: (
          <div className="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
            <AlertTriangle></AlertTriangle>
            <span>{consts.global.deleteMessage}</span>
          </div>
        ),
        accept: () => {
          mutation(DeleteUser, { ids: selectedRowItem.map((x) => x.id) })
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
    function onRevertRecords() {
      confirmDialog({
        header: consts.global.revert,
        acceptLabel: consts.global.yes,
        rejectLabel: consts.global.no,
        message: (
          <div className="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
            <AlertTriangle></AlertTriangle>
            <span>{consts.global.revertMessage}</span>
          </div>
        ),
        accept: () => {
          mutation(RevertDeleteUser, { ids: selectedRowItem.map((x) => x.id) })
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
    function onToggleRecords() {
      confirmDialog({
        header: consts.global.toggleActivation,
        acceptLabel: consts.global.yes,
        rejectLabel: consts.global.no,
        message: (
          <div className="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
            <AlertTriangle></AlertTriangle>
            <span>{consts.global.toggleMessage}</span>
            <div className="flex gap-2 m-auto mx-4 justify-center">
              <Button
                color="secondary"
                text
                onClick={() => onSetToggleGroupActivation(false)}
              >
                {consts.global.inActive}
              </Button>
              <Button
                color="success"
                text
                onClick={() => onSetToggleGroupActivation(true)}
              >
                {consts.global.active}
              </Button>
            </div>
          </div>
        ),
      });
    }
    function onSetToggleGroupActivation(state: boolean) {
      mutation(ChangeActivationUser, {
        ids: selectedRowItem.map((x) => x.id),
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
    return (
      <>
        {selectedRowItem.length !== 0 ? (
          <>
            <div className="w-auto flex gap-8">
              <div className="w-auto my-auto">
                {consts.global.totalSelectedItem} : {selectedRowItem.length}
              </div>
              <div className="w-auto flex gap-2">
                <Button
                  onClick={() => setCancel()}
                  outlined
                  size="small"
                  className="text-lg w-auto"
                >
                  {consts.global.cancel}
                </Button>
                <Button
                  onClick={() => onDeleteRecords()}
                  severity="danger"
                  size="small"
                  className="text-lg w-auto"
                >
                  {consts.global.delete}
                </Button>
                <Button
                  onClick={() => onRevertRecords()}
                  severity="warning"
                  size="small"
                  className="text-lg w-auto"
                >
                  {consts.global.revert}
                </Button>
                <Button
                  onClick={() => onToggleRecords()}
                  severity="info"
                  size="small"
                  className="text-lg w-auto"
                >
                  {consts.global.toggleActivation}
                </Button>
              </div>
            </div>
            <ConfirmDialog />
          </>
        ) : (
          <div className="w-auto">
            <Button
              onClick={showModalFn}
              size="small"
              className="text-lg w-auto"
            >
              {consts.global.create}
            </Button>
          </div>
        )}
      </>
    );
  }, [selectedRowItem]);

  const renderDialogContent = useCallback(() => {
    return (
      <div>
        <label>{userUpsertTitle}</label>
        <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
          <Input
            required
            labelPlacement="outside"
            variant="bordered"
            size="lg"
            radius={"lg"}
            {...register("userName", { required: true })}
            label={consts.submit.info.userName}
            placeholder={consts.submit.placeholder.enterUsername}
          ></Input>
          <Input
            type="password"
            required
            labelPlacement="outside"
            variant="bordered"
            size="lg"
            radius={"lg"}
            {...register("password", { required: true })}
            label={consts.login.info.password}
            placeholder={consts.submit.placeholder.enterPassword}
          ></Input>
          <Input
            required
            labelPlacement="outside"
            variant="bordered"
            size="lg"
            radius={"lg"}
            {...register("nationalCode", { required: true })}
            label={consts.submit.info.nationalCode}
            placeholder={consts.submit.placeholder.enterNationalCode}
          ></Input>
          <Input
            required
            labelPlacement="outside"
            variant="bordered"
            size="lg"
            radius={"lg"}
            {...register("email", { required: true })}
            label={consts.submit.info.email}
            placeholder={consts.submit.placeholder.enterEmail}
          ></Input>
          <Input
            required
            labelPlacement="outside"
            variant="bordered"
            size="lg"
            radius={"lg"}
            {...register("phone", { required: true })}
            label={consts.submit.info.phone}
            placeholder={consts.submit.placeholder.enterPhone}
          ></Input>
          <div className="flex justify-start gap-2">
            <Button type="submit" color="primary">
              {consts.global.create}
            </Button>
            <Button color="danger" variant="light" onPress={onClose}>
              {consts.global.cancel}
            </Button>
          </div>
        </form>
      </div>
    );
  }, []);
  //#endregion

  //#region ------------- html section --------------------
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
      <Dialog
        visible={visible}
        modal
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        content={renderDialogContent}
      ></Dialog>
    </div>
  );
  //#endregion
}
