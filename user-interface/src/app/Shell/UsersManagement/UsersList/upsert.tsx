import { IUpsertUser } from "@/interfaces/IUser";
import { consts } from "@/utils/consts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UserUpsert } from "./zod-schema";
import { mutation } from "@/services/graphql/apollo";
import { ErrorHandler } from "@/services/graphql/graphql-error-handler";
import {
  CreateUserItem,
  UpdateUserItem,
} from "@/services/graphql/user.query-doc";

export const UpsertUser = (props: IProps) => {
  //#region-------------- variables -----------------------
  const [userUpsertTitle, setUserUpsertTitle] = useState(
    consts.titles.userCreate
  );
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IUpsertUser>({ resolver: zodResolver(UserUpsert) });
  //#endregion

  //#region ------------- main function -------------------
  useEffect(() => {
    if (props.editInfo) {
      setUserUpsertTitle(consts.titles.userEdit);
      onSetUserInfoToForm(props.editInfo);
    }
  }, [props.editInfo]);
  const onSetUserInfoToForm = (userInfo: IUpsertUser) => {
    setValue("userName", userInfo.userName);
    setValue("nationalCode", userInfo.nationalCode);
    setValue("email", userInfo.email);
    setValue("phone", userInfo.phone);
  };
  const onSubmit = async (values: IUpsertUser) => {
    setLoading(true);
    mutation<IUpsertUser>(props.editInfo ? UpdateUserItem : CreateUserItem, {
      id: props.editInfo?.id,
      email: values.email,
      nationalCode: values.nationalCode,
      phone: values.phone,
      userName: values.userName,
    })
      .then(() => {
        setLoading(false);
        reset();
        props.setVisible(false);
      })
      .catch((error) => {
        ErrorHandler(error);
      });
  };
  const onCancel = () => {
    reset();
    props.setVisible(false);
  };

  return (
    <Dialog
      visible={props.visible}
      className="w-[30rem]"
      modal
      closable={false}
      header={userUpsertTitle}
      onHide={() => {
        if (!props.visible) return;
        props.setVisible(false);
      }}
    >
      <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="my-4">
          <div>
            <label>{consts.titles.userName}</label>
          </div>
          <Controller
            control={control}
            name="userName"
            render={({ field }) => (
              <InputText
                className="w-full"
                variant="filled"
                {...field}
                placeholder={consts.placeholders.enterUserName}
              />
            )}
          />
          <span className="error-message-style">
            {errors.userName && errors.userName.message}
          </span>
        </div>
        {props.editInfo ? (
          ""
        ) : (
          <div className="my-4">
            <div>
              <label>{consts.titles.password}</label>
            </div>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <InputText
                  variant="filled"
                  className="w-full"
                  {...field}
                  placeholder={consts.placeholders.enterPassword}
                />
              )}
            ></Controller>
            <span className="error-message-style">
              {errors.password && errors.password.message}
            </span>
          </div>
        )}
        <div className="my-4">
          <div>
            <label>{consts.titles.nationalCode}</label>
          </div>
          <Controller
            control={control}
            name="nationalCode"
            render={({ field }) => (
              <InputText
                variant="filled"
                className="w-full"
                {...field}
                placeholder={consts.placeholders.enterNationalCode}
              />
            )}
          ></Controller>
          <span className="error-message-style">
            {errors.nationalCode && errors.nationalCode.message}
          </span>
        </div>
        <div className="my-4">
          <div>
            <label>{consts.titles.email}</label>
          </div>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <InputText
                variant="filled"
                className="w-full"
                {...field}
                placeholder={consts.placeholders.enterEmail}
              />
            )}
          ></Controller>
          <span className="error-message-style">
            {errors.email && errors.email.message}
          </span>
        </div>
        <div className="my-4">
          <div>
            <label>{consts.titles.phone}</label>
          </div>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <InputText
                variant="filled"
                className="w-full"
                {...field}
                placeholder={consts.placeholders.enterPhone}
              />
            )}
          ></Controller>
          <span className="error-message-style">
            {errors.phone && errors.phone.message}
          </span>
        </div>
        <div className="flex justify-start gap-2">
          <Button type="submit" color="primary">
            {consts.titles.create}
          </Button>
          <Button color="danger" onClick={() => onCancel()}>
            {consts.titles.cancel}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
//#endregion

//#region --------------- interfaces ----------------------
interface IProps {
  visible: boolean;
  editInfo: IUpsertUser | null;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
//#endregion
