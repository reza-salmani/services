import Loader from "@/components/common/Loader";
import { IUser } from "@/interfaces/IUser";
import { mutation, query } from "@/services/graphql/apollo";
import { ErrorHandler } from "@/services/graphql/graphql-error-handler";
import {
  GetOneUser,
  GetPages,
  UpdateUserPagePermissions,
} from "@/services/graphql/user.query-doc";
import { consts } from "@/utils/consts";
import { Tools } from "@/utils/tools";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { TreeNode } from "primereact/treenode";
import { TreeSelect } from "primereact/treeselect";
import { useEffect, useRef, useState } from "react";

export const UpdateUserPagePermission = (props: IProps) => {
  let toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState<TreeNode[] | null>(null);
  let [selectedPages, setSelectedPages] = useState<any>(null);
  const onCancel = () => {
    props.setVisible(false);
  };
  const onGetSelectedPagePermissions = async () => {
    let { data } = await query(GetOneUser, {
      query: { where: { id: props.userInfo[0].id } },
    });
    let obj: any = {};
    data.getUserByQuery.permittedPage.map((x: string) => {
      obj[x] = true;
      return x;
    });
    setSelectedPages(obj);
  };
  const onGetPages = async () => {
    let { data } = await query(GetPages);
    setPages(
      Tools.createTreeNode(
        JSON.parse(JSON.stringify(data.menu)),
        "id",
        "persianName",
        "children"
      )
    );
  };
  const onSubmit = async () => {
    setLoading(true);
    try {
      let { data } = await mutation(UpdateUserPagePermissions, {
        pageIds: Object.keys(selectedPages),
        userId: props.userInfo[0].id,
      });
      if (data.UpdateUserPagePermission) {
        setLoading(false);
        toast.current?.show({
          severity: "success",
          summary: "200",
          detail: consts.messages.successPagePermissionsUpdate,
        });
        props.setVisible(false);
      }
    } catch (errors) {
      setLoading(false);
      toast.current?.show(ErrorHandler(errors));
    }
  };
  useEffect(() => {
    onGetPages();
    onGetSelectedPagePermissions();
  }, []);
  return (
    <Dialog
      visible={props.visible}
      className="w-[30rem] h-[20rem]"
      closable={false}
      header={consts.titles.updateUserPagePermission}
      onHide={() => {
        if (!props.visible) return;
        props.setVisible(false);
      }}
    >
      <Toast onHide={onCancel} ref={toast}></Toast>
      <Loader loading={loading}>
        <TreeSelect
          value={selectedPages}
          options={pages!}
          onChange={(e: any) => setSelectedPages(e.value)}
          className="w-full"
          selectionMode="multiple"
          placeholder={consts.placeholders.chooseAnItem}
        ></TreeSelect>
        <div className="flex justify-start p-4 pb-0">
          <Button
            className="mx-2"
            severity="info"
            label={consts.titles.submit}
            onClick={onSubmit}
          ></Button>
          <Button
            severity="danger"
            label={consts.titles.cancel}
            onClick={onCancel}
          ></Button>
        </div>
      </Loader>
    </Dialog>
  );
};

//#region --------------- interfaces ----------------------
interface IProps {
  visible: boolean;
  userInfo: IUser[];
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
//#endregion
