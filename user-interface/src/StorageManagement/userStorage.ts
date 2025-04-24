import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { IUser } from "@/interfaces/IUser";

//#region ------------- manage user mermission ------------
export type UserPermissionState = {
  hasPermission: boolean;
};
export type UserInfoState = {
  userInfo: IUser | null;
};

export type UserPermissionActions = {
  setPermission: () => void;
};
export type UserInfoActions = {
  setUserInfo: () => void;
};

export type UserPermissionStore = UserPermissionState & UserPermissionActions;
export type UserInfoStore = UserInfoState & UserInfoActions;

export const defaultInitState: UserPermissionState = {
  hasPermission: false,
};
export const defaultInitInfoState: UserInfoState = {
  userInfo: null,
};

export const createUserPermissionStore = (
  initState: UserPermissionState = defaultInitState
) => {
  return createStore<UserPermissionStore>()(
    persist(
      (set, get) => ({
        ...initState,
        setPermission: () =>
          set((state) => ({
            hasPermission: get() ? get().hasPermission : state.hasPermission,
          })),
      }),
      { name: "user-permission" }
    )
  );
};
export const createUserInfoStore = (
  initState: UserInfoState = defaultInitInfoState
) => {
  return createStore<UserInfoStore>()(
    persist(
      (set, get) => ({
        ...initState,
        setUserInfo: () =>
          set((state) => ({
            userInfo: get() ? get().userInfo : state.userInfo,
          })),
      }),
      { name: "user-permission" }
    )
  );
};
//#endregion
