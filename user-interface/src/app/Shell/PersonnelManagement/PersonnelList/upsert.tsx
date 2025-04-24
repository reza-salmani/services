"use client";
import { consts } from "@/utils/consts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { PersonnelUpsert } from "./zod-schema";
import { classNames } from "primereact/utils";
import { mutation } from "@/services/graphql/apollo";
import { ErrorHandler } from "@/services/graphql/graphql-error-handler";
import {
  UpdatePersonnel,
  CreatePersonnel,
} from "@/services/graphql/user.query-doc";
import { Toast } from "primereact/toast";
import {
  IUpsertPersonnel,
  IUpsertPersonnelForm,
} from "@/interfaces/IPersonnel";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";

export const UpsertPersonnel = (props: IProps) => {
  const [personnelUpsertTitle, setPersonnelUpsertTitle] = useState(
    consts.titles.personnelCreate
  );
  const toast = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IUpsertPersonnelForm>({ resolver: zodResolver(PersonnelUpsert) });
  useEffect(() => {
    onCancel(false);
    if (props.editInfo) {
      setPersonnelUpsertTitle(consts.titles.personnelEdit);
      onSetUserInfoToForm(props.editInfo);
    }
  }, [props.visible]);
  const onSetUserInfoToForm = (personnelInfo: IUpsertPersonnel) => {
    setValue("name", personnelInfo.name);
    setValue("family", personnelInfo.family);
    setValue("nationalCode", personnelInfo.nationalCode);
    setValue("birthDate", new Date(personnelInfo.birthDate));
    setValue("activation", personnelInfo.activation);
  };
  const onSubmit = async (values: IUpsertPersonnelForm) => {
    setLoading(true);
    mutation<IUpsertPersonnel>(
      props.editInfo ? UpdatePersonnel : CreatePersonnel,
      {
        id: props.editInfo?.id,
        name: values.name,
        nationalCode: values.nationalCode,
        family: values.family,
        birthDate: values.birthDate,
        activation: values.activation,
      }
    )
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
      name: "",
      nationalCode: "",
      family: "",
      birthDate: new Date(),
      activation: false,
    });
    if (state) props.setVisible(false);
  };

  return (
    <Dialog
      visible={props.visible}
      className="w-[30rem]"
      closable={false}
      header={personnelUpsertTitle}
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
        <div>
          <div>
            <label>{consts.titles.name}</label>
          </div>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <InputText
                className={classNames(
                  "w-full p-2",
                  errors.name ? "p-invalid" : ""
                )}
                {...field}
                id="userName"
                placeholder={consts.placeholders.enterName}
              ></InputText>
            )}
          />
          <span className="error-message-style">
            {errors.name && errors.name.message}
          </span>
        </div>
        <div>
          <div>
            <label>{consts.titles.family}</label>
          </div>
          <Controller
            control={control}
            name="family"
            render={({ field }) => (
              <InputText
                className={classNames(
                  "w-full p-2",
                  errors.family ? "p-invalid" : ""
                )}
                {...field}
                placeholder={consts.placeholders.enterFamily}
              ></InputText>
            )}
          ></Controller>
          <span className="error-message-style">
            {errors.family && errors.family.message}
          </span>
        </div>
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
                  errors.nationalCode ? "p-invalid" : ""
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
            <label>{consts.titles.birthDate}</label>
          </div>
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <Calendar
                showTime={true}
                selectionMode="single"
                className={classNames(
                  "w-full p-2",
                  errors.birthDate ? "p-invalid" : ""
                )}
                {...field}
                placeholder={consts.placeholders.enterBirthDate}
              ></Calendar>
            )}
          ></Controller>
          <span className="error-message-style">
            {errors.birthDate && errors.birthDate.message}
          </span>
        </div>
        <div className="flex">
          <div className="ml-2">
            <label>{consts.titles.activation}</label>
          </div>
          <Controller
            control={control}
            name="activation"
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                className={classNames("", errors.activation ? "p-invalid" : "")}
                {...field}
                onChange={(e) => field.onChange(e.checked)}
                placeholder={consts.placeholders.enterActivation}
              ></Checkbox>
            )}
          ></Controller>
          <span className="error-message-style">
            {errors.activation && errors.activation.message}
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

//#region --------------- interfaces ----------------------
interface IProps {
  visible: boolean;
  editInfo: IUpsertPersonnel | null;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
//#endregion
