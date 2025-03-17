import Loader from "@/components/common/Loader";
import { IUser } from "@/interfaces/IUser";
import { mutation, query } from "@/services/graphql/apollo";
import { ErrorHandler } from "@/services/graphql/graphql-error-handler";
import { GetRoles, UpdateRoles } from "@/services/graphql/user.query-doc";
import { consts } from "@/utils/consts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

export const UpdateUserRoles = (props: IProps) => {
  //#region ------------- variables -----------------------
  const toast = useRef<Toast>(null);
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(z.object({ roles: z.string().array() })),
  });
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  //#endregion

  //#region ------------- functions -----------------------
  useEffect(() => {
    onGetRoles();
  }, []);
  const onGetRoles = async () => {
    const { data, loading, errors } = await query(GetRoles);
    if (!loading) {
      if (errors) {
        toast.current!.show(ErrorHandler(errors));
      }
      setRoles(data.roles);
    }
  };
  const onCancel = () => {
    props.setVisible(false);
  };
  const onSubmit = async ({ roles }: { roles: string[] }) => {
    setLoading(true);
    let { data, errors } = await mutation(UpdateRoles, {
      ids: props.userInfo.map((user) => user.id),
      roles: roles,
    });
    if (data.UpdateUserRoles) {
      setLoading(false);
      toast.current?.show({
        severity: "success",
        summary: "200",
        detail: consts.messages.successUserRolesUpdate,
      });
    }
    if (errors) {
      toast.current?.show(ErrorHandler(errors));
    }
  };
  //#endregion

  return (
    <Dialog
      visible={props.visible}
      className="w-[30rem]"
      closable={false}
      header={consts.titles.updateRole}
      onHide={() => {
        if (!props.visible) return;
        props.setVisible(false);
      }}
    >
      <Toast
        onHide={onCancel}
        appendTo={document.querySelector("body")}
        ref={toast}
      ></Toast>
      <Loader loading={loading}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div>
            <div>
              <label>{consts.titles.roles}</label>
            </div>
            <Controller
              control={control}
              name="roles"
              render={({ field }) => (
                <MultiSelect
                  className="w-full"
                  options={roles}
                  {...field}
                  id="roles"
                  placeholder={consts.placeholders.chooseAnItem}
                />
              )}
            />
          </div>
          <div className="flex justify-start gap-2">
            <Button type="submit">{consts.titles.submit}</Button>
            <Button
              type="button"
              severity="danger"
              text
              onClick={() => onCancel()}
            >
              {consts.titles.cancel}
            </Button>
          </div>
        </form>
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
