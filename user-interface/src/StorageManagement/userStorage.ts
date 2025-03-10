import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";

//#region ------------- manage user mermission ------------
export type UserPermissionState = {
  hasPermission: boolean;
};

export type UserPermissionActions = {
  setPermission: () => void;
};

export type UserPermissionStore = UserPermissionState & UserPermissionActions;

export const defaultInitState: UserPermissionState = {
  hasPermission: false,
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
//#endregion
