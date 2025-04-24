"use client";
import Loader from "@/components/common/Loader";
import { IResponseData } from "@/interfaces/IBase";
import { IPersonnel, IUpsertPersonnel } from "@/interfaces/IPersonnel";
import { mutation, query } from "@/services/graphql/apollo";
import { ErrorHandler } from "@/services/graphql/graphql-error-handler";
import {
  CheckWritable,
  DeletePersonnel,
  GetAllPersonnel,
  ToggleActivationPersonnel,
} from "@/services/graphql/user.query-doc";
import {
  createUserInfoStore,
  createUserPermissionStore,
} from "@/StorageManagement/userStorage";
import { consts } from "@/utils/consts";
import { dateTools } from "@/utils/date";
import {
  AlertTriangle,
  EditIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
  Trash2,
} from "lucide-react";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { UpsertPersonnel } from "./upsert";

export default function PersonnelList() {
  //#region ------------- variables -----------------------
  const [paginationItems, setPaginationItems] = useState<
    IResponseData<IPersonnel>
  >({
    items: [],
    pageNumber: 1,
    pageSize: 10,
    totalCount: 1,
  });
  const { getState } = createUserPermissionStore({
    hasPermission: false,
  });
  const [loading, setLoading] = useState(false);
  let writable = useRef(false);
  const [visible, setVisible] = useState(false);
  const [showPagePermission, setShowPagePermission] = useState(false);
  const [visibleUpdateRole, setVisibleUpdateRole] = useState(false);
  const [editInfo, setEditInfo] = useState<IUpsertPersonnel | null>(null);
  const [selectedRowItem, setSelectedRowItem] = useState<IPersonnel[]>([]);
  const columns = [
    { label: "نام", key: "name" },
    { label: "نام خانوادگی", key: "family" },
    { label: "کد ملی پرسنل", key: "nationalCode" },
    { label: "تاریخ تولد", key: "birthDate" },
    { label: "وضعیت", key: "activation" },
    { label: "عملیات", key: "actions" },
  ];
  //#endregion

  //#region ------------- rendered functions --------------
  const renderCell = useCallback((people: any, column: any) => {
    const cellValue = people["avatarPath"];
    const [userRoles, setUserRoles] = useState<string[]>([]);
    const { getState } = createUserInfoStore({
      userInfo: null,
    });
    useEffect(() => {
      setUserRoles(getState().userInfo?.roles!);
    }, []);
    switch (column.field) {
      case "name":
        return (
          <div className="flex gap-2">
            <Avatar
              image={cellValue}
              size="large"
              shape="circle"
              className="hover:cursor-pointer"
            />
            <div className="">
              <div className="font-bold">{people.name}</div>
              <div className="text-sm text-surface-400">{people.family}</div>
            </div>
          </div>
        );
      case "nationalCode":
        return <div>{people[column.field]}</div>;
      case "birthDate":
        return (
          <div>
            {people[column.field]
              ? dateTools.toPersian(people[column.field], "long")
              : ""}
          </div>
        );
      case "activation":
        return (
          <Tag
            rounded
            severity="success"
            value={people[column.field] ? "فعال" : "غیرفعال"}
          ></Tag>
        );

      case "actions":
        return userRoles?.some((x: string) => x === "Admin") ||
          !writable.current ? (
          ""
        ) : (
          <div className="relative flex items-center gap-4">
            <Button
              tooltip={consts.titles.toggleActivation}
              tooltipOptions={{
                className: "text-warning-400",
                position: "bottom",
              }}
              className={classNames(
                ["text-lg cursor-pointer active:opacity-50"],
                !people.activation ? ["text-zinc-500"] : ["text-sky-500"]
              )}
              text
              onClick={() =>
                onSetToggleActivation([people], !people.activation)
              }
              icon={
                !people.activation ? <ToggleLeftIcon /> : <ToggleRightIcon />
              }
            ></Button>
            <Button
              tooltip={consts.titles.edit}
              tooltipOptions={{
                className: "text-success-400",
                position: "bottom",
              }}
              onClick={() => showUpsertComponent(people)}
              className="text-lg text-zinc-500 cursor-pointer active:opacity-50"
              text
              icon={<EditIcon />}
            ></Button>
            <Button
              tooltip={consts.titles.delete}
              tooltipOptions={{
                className: "text-danger-400",
                position: "bottom",
              }}
              className="text-lg text-zinc-500 cursor-pointer active:opacity-50"
              onClick={() => onDeleteRecords([people])}
              text
              icon={<Trash2 />}
            ></Button>
          </div>
        );
      default:
        return <div>{people[column.field]}</div>;
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
    return query(GetAllPersonnel, {
      queries: {
        take: paginationItems.pageSize,
        skip:
          paginationItems.pageNumber > 0
            ? (paginationItems.pageNumber - 1) * paginationItems.pageSize
            : 0,
      },
    }).then((res) => {
      setPaginationItems({
        items: res.data.getAllPersonnel,
        pageNumber: res.data.getAllPersonnel.pageNumber,
        pageSize: res.data.getAllPersonnel.pageSize,
        totalCount: res.data.getAllPersonnel.totalCount,
      });
      return res;
    });
  };
  useEffect(() => {
    getAllDataFunction();
    onCheckWritable();
  }, []);
  const onCheckWritable = async () => {
    let result = await query(CheckWritable, { menuName: "PersonnelList" });
    writable.current = result.data.checkWritable;
  };
  const recoursiveMenu = (result: any) => {
    return result.map((menu: any) => {
      menu.label = menu.persianName;
      menu.key = menu.name;
      menu.id = menu.id;
      menu.selectable = !menu.isReadOnly;
      if (menu.children) {
        recoursiveMenu(menu.children);
      }
      return menu;
    });
  };
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
  function onSetToggleActivation(selectedItems: IPersonnel[], state: boolean) {
    mutation(ToggleActivationPersonnel, {
      ids: selectedItems.map((x) => x.id),
      status: state,
    })
      .then((res) => {
        getAllDataFunction();
        setSelectedRowItem([]);
      })
      .catch((error) => {
        ErrorHandler(error);
      });
  }
  function onDeleteRecords(selectedItems: IPersonnel[]) {
    console.log(selectedItems);

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
        mutation(DeletePersonnel, { ids: selectedItems.map((x) => x.id) })
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
  const showUpsertComponent = (user: IUpsertPersonnel | null) => {
    setEditInfo(user);
    setVisible(true);
  };
  let toast = useRef<Toast>(null);
  return (
    <div
      className="bg-slate-100 relative dark:bg-slate-950 p-4 rounded-2xl"
      style={{ height: "calc(100vh - 8rem)" }}
    >
      <ConfirmDialog />
      <Toast ref={toast}></Toast>
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
      {visible ? (
        <UpsertPersonnel
          visible={visible}
          setVisible={(event) => onHideUpsert()}
          editInfo={editInfo}
        ></UpsertPersonnel>
      ) : (
        ""
      )}
    </div>
  );
  //#endregion
}
