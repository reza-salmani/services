"use client";
import { IResponseData } from "@/interfaces/IBase";
import { ISubmitUser, IToggleActivation, IUser } from "@/interfaces/IUser";
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
import {
  Alert,
  Button,
  Chip,
  getKeyValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
  User,
} from "@heroui/react";
import clsx from "clsx";
import {
  EditIcon,
  EyeIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  Trash2,
  Undo2,
} from "lucide-react";
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
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const { getState } = createUserPermissionStore();
  const [showDeletedDialog, setShowDeletedDialog] = useState(false);
  const [showRevertDialog, setShowRevertDialog] = useState(false);
  const [showToggleDialog, setShowToggleDialog] = useState(false);
  const [selectedRowItem, setSelectedRowItem] = useState(new Set([]));
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
    onOpen();
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
        onClose();
        getAllDataFunction();
      })
      .catch((error) => {
        ErrorHandler(error);
      });
  }
  async function onSetToggleActivation(user: IUser, state: boolean) {
    setLoading(true);
    mutation<IToggleActivation>(ChangeActivationUser, {
      ids: [user.id],
      state: state,
    })
      .then(() => {
        setLoading(false);
        getAllDataFunction();
      })
      .catch((error) => {
        ErrorHandler(error);
      });
  }
  async function onSetToggleGroupActivation(ids: any, state: boolean) {
    setLoading(true);
    mutation<IToggleActivation>(ChangeActivationUser, {
      ids: Array.from(ids),
      state: state,
    })
      .then(() => {
        setLoading(false);
        setShowToggleDialog(false);
        setCancel();
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
  async function manageDeleteAndRevert(user: IUser, type: "revert" | "delete") {
    setLoading(true);
    mutation(type === "delete" ? DeleteUser : RevertDeleteUser, {
      ids: [user.id],
    })
      .then(() => {
        setLoading(false);
        getAllDataFunction();
      })
      .catch((error) => {
        ErrorHandler(error);
        setLoading(false);
      });
  }
  async function manageGroupDeleteAndRevert(
    ids: any,
    type: "revert" | "delete"
  ) {
    setLoading(true);
    mutation(type === "delete" ? DeleteUser : RevertDeleteUser, {
      ids: Array.from(ids),
    })
      .then(() => {
        setLoading(false);
        setShowDeletedDialog(false);
        setCancel();
        setShowRevertDialog(false);
        getAllDataFunction();
      })
      .catch((error) => {
        ErrorHandler(error);
        setLoading(false);
      });
  }
  async function onSelectRow(selection: any) {
    setSelectedRowItem(selection);
  }
  function setCancel() {
    setSelectedRowItem(new Set([]));
  }
  //#endregion

  //#region ------------- rendered Function ---------------
  const renderCell = useCallback((user: any, columnkey: any) => {
    const cellValue = user[columnkey];
    switch (columnkey) {
      case "userName":
        return (
          <User
            classNames={{ description: "font-bold text-md" }}
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue}
          >
            {getKeyValue(user, columnkey)}
          </User>
        );
      case "isActive":
        return (
          <Chip color="success">
            {getKeyValue(user, columnkey) ? "فعال" : "غیرفعال"}
          </Chip>
        );
      case "isDeleted":
        return (
          <Chip color="danger">
            {getKeyValue(user, columnkey) ? "حذف شده" : "موجود"}
          </Chip>
        );
      case "createDate":
      case "updateDate":
      case "deleteDate":
      case "revertDate":
        return (
          <div>
            {user[columnkey]
              ? dateTools.toPersian(user[columnkey], "long")
              : ""}
          </div>
        );
      case "actions":
        return user.roles.some((x: string) => x === "Admin") ? (
          ""
        ) : (
          <div className="relative flex items-center gap-4">
            <Tooltip color="warning" content={consts.global.toggleActivation}>
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
            )}
          </div>
        );
      default:
        return <div>{getKeyValue(user, columnkey)}</div>;
    }
  }, []);
  const pagination = useCallback((totalRecord: number, page: number) => {
    return (
      <div className="flex w-full justify-center">
        <Pagination
          showControls
          color="primary"
          page={page}
          dir="ltr"
          initialPage={1}
          variant="bordered"
          total={Math.ceil(totalRecord / paginationItems.pageSize)}
          onChange={(skip) => onChangePagination(skip)}
        />
      </div>
    );
  }, []);
  const headerItems = selectedRowItem.size ? (
    <>
      <div className="w-auto flex gap-8">
        <div className="w-auto my-auto">
          {consts.global.totalSelectedItem} : {selectedRowItem.size}
        </div>
        <div className="w-auto flex gap-2">
          <Button
            onPress={() => setCancel()}
            variant="flat"
            color="default"
            className="text-lg w-auto"
          >
            {consts.global.cancel}
          </Button>
          <Button
            onPress={() => setShowDeletedDialog(true)}
            variant="solid"
            color="danger"
            className="text-lg w-auto"
          >
            {consts.global.delete}
          </Button>
          <Button
            onPress={() => setShowRevertDialog(true)}
            variant="solid"
            color="success"
            className="text-lg w-auto"
          >
            {consts.global.revert}
          </Button>
          <Button
            onPress={() => setShowToggleDialog(true)}
            variant="solid"
            color="warning"
            className="text-lg w-auto"
          >
            {consts.global.toggleActivation}
          </Button>
        </div>
      </div>
      <Alert
        isVisible={showDeletedDialog}
        color="danger"
        description={consts.global.deleteMessage}
        endContent={
          <Button
            color="danger"
            size="sm"
            variant="flat"
            onPress={() =>
              manageGroupDeleteAndRevert(selectedRowItem, "delete")
            }
          >
            {consts.global.delete}
          </Button>
        }
        variant="faded"
      />
      <Alert
        isVisible={showRevertDialog}
        color="danger"
        description={consts.global.revertMessage}
        endContent={
          <Button
            color="warning"
            size="sm"
            variant="flat"
            onPress={() =>
              manageGroupDeleteAndRevert(selectedRowItem, "revert")
            }
          >
            {consts.global.delete}
          </Button>
        }
        variant="faded"
      />
      <Alert
        isVisible={showToggleDialog}
        color="danger"
        onClose={() => setShowToggleDialog(false)}
        description={consts.global.toggleMessage}
        endContent={
          <div className="flex gap-2 m-auto mx-4 justify-center">
            <Button
              color="secondary"
              size="sm"
              variant="flat"
              onPress={() => onSetToggleGroupActivation(selectedRowItem, false)}
            >
              {consts.global.inActive}
            </Button>
            <Button
              color="success"
              size="sm"
              variant="flat"
              onPress={() => onSetToggleGroupActivation(selectedRowItem, true)}
            >
              {consts.global.active}
            </Button>
          </div>
        }
        variant="faded"
      />
    </>
  ) : (
    <div className="w-auto">
      <Button
        onPress={showModalFn}
        variant="solid"
        color="primary"
        className="text-lg w-auto"
      >
        {consts.global.create}
      </Button>
    </div>
  );
  //#endregion

  //#region ------------- html section --------------------
  return (
    <div
      className="bg-slate-100 relative dark:bg-slate-950 p-4 rounded-2xl"
      style={{ height: "calc(100vh - 7.05rem)" }}
    >
      {loading ? (
        <div className="left-[calc(100vw-53%)] top-[calc(100vh-70%)] absolute z-20">
          <Spinner variant="spinner" size="lg" color="primary" />
        </div>
      ) : (
        ""
      )}
      <Table
        isStriped
        color="secondary"
        selectedKeys={selectedRowItem}
        selectionMode="multiple"
        onSelectionChange={(selection) => onSelectRow(selection)}
        topContent={headerItems}
        bottomContent={pagination(
          paginationItems.totalCount,
          paginationItems.pageNumber
        )}
        aria-labelledby="this is table for user"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              className="bg-blue-400 text-white text-medium"
              key={column.key}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={paginationItems.items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {userUpsertTitle}
              </ModalHeader>
              <ModalBody>
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
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
  //#endregion
}
