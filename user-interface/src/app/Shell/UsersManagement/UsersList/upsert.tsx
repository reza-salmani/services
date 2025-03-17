import { IUpsertUser } from "@/interfaces/IUser";
import { consts } from "@/utils/consts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { UserUpsert } from "./zod-schema";
import { classNames } from "primereact/utils";
import { mutation } from "@/services/graphql/apollo";
import { ErrorHandler } from "@/services/graphql/graphql-error-handler";
import {
  UpdateUserItem,
  CreateUserItem,
} from "@/services/graphql/user.query-doc";
import { Toast } from "primereact/toast";

export const UpsertUser = (props: IProps) => {
  //#region-------------- variables -----------------------
  const [userUpsertTitle, setUserUpsertTitle] = useState(
    consts.titles.userCreate
  );
  const toast = useRef<any>(null);
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
    onCancel(false);
    if (props.editInfo) {
      setUserUpsertTitle(consts.titles.userEdit);
      onSetUserInfoToForm(props.editInfo);
    }
  }, [props.visible]);
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
      password: values.password,
    })
      .then(() => {
        toast.current.show({
          severity: "success",
          summary: "200",
          life: 1000,
          detail: props.editInfo
            ? consts.messages.successEdit
            : consts.messages.successCreate,
        });
      })
      .catch((error) => {
        toast.current.show(ErrorHandler(error));
      });
  };
  const onCancel = (state: boolean = true) => {
    reset({
      email: "",
      nationalCode: "",
      password: "",
      phone: "",
      userName: "",
    });
    if (state) props.setVisible(false);
  };

  return (
    <Dialog
      visible={props.visible}
      className="w-[30rem]"
      closable={false}
      header={userUpsertTitle}
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
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        {props.editInfo ? (
          ""
        ) : (
          <>
            <div>
              <div>
                <label>{consts.titles.userName}</label>
              </div>
              <Controller
                control={control}
                name="userName"
                render={({ field }) => (
                  <InputText
                    className={classNames(
                      "w-full p-2",
                      errors.userName ? "p-invalid" : ""
                    )}
                    {...field}
                    id="userName"
                    placeholder={consts.placeholders.enterUserName}
                  ></InputText>
                )}
              />
              <span className="error-message-style">
                {errors.userName && errors.userName.message}
              </span>
            </div>
            <div>
              <div>
                <label>{consts.titles.password}</label>
              </div>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <InputText
                    className={classNames(
                      "w-full p-2",
                      errors.userName ? "p-invalid" : ""
                    )}
                    {...field}
                    placeholder={consts.placeholders.enterPassword}
                  ></InputText>
                )}
              ></Controller>
              <span className="error-message-style">
                {errors.password && errors.password.message}
              </span>
            </div>
          </>
        )}
        <div>
          <div>
            <label>{consts.titles.nationalCode}</label>
          </div>
          <Controller
            control={control}
            name="nationalCode"
            render={({ field }) => (
              <InputText
                className={classNames(
                  "w-full p-2",
                  errors.userName ? "p-invalid" : ""
                )}
                {...field}
                placeholder={consts.placeholders.enterNationalCode}
              ></InputText>
            )}
          ></Controller>
          <span className="error-message-style">
            {errors.nationalCode && errors.nationalCode.message}
          </span>
        </div>
        <div>
          <div>
            <label>{consts.titles.email}</label>
          </div>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <InputText
                className={classNames(
                  "w-full p-2",
                  errors.userName ? "p-invalid" : ""
                )}
                {...field}
                placeholder={consts.placeholders.enterEmail}
              ></InputText>
            )}
          ></Controller>
          <span className="error-message-style">
            {errors.email && errors.email.message}
          </span>
        </div>
        <div>
          <div>
            <label>{consts.titles.phone}</label>
          </div>
          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <InputText
                className={classNames(
                  "w-full p-2",
                  errors.userName ? "p-invalid" : ""
                )}
                {...field}
                placeholder={consts.placeholders.enterPhone}
              ></InputText>
            )}
          ></Controller>
          <span className="error-message-style">
            {errors.phone && errors.phone.message}
          </span>
        </div>
        <div className="flex justify-start gap-2">
          <Button type="submit">
            {props.editInfo ? consts.titles.edit : consts.titles.create}
          </Button>
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
