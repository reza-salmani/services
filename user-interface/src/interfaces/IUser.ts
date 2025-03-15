export interface IInputLogin {
  userName: string;
  password: string;
}

export interface IForgotPassword {
  userName: string;
  newPassword: string;
}
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phone: string;
  password: string;
  wrongPasswordCounter: number;
  lockDownDate: string;
  createDate: string;
  updateDate: string;
  deleteDate: string;
  revertDate: string;
  passwordChangeLastDate: string;
  isDeleted: boolean;
  isActive: boolean;
  roles: string[];
}
export interface IUpsertUser {
  id?: string;
  nationalCode: string;
  userName: string;
  email: string;
  phone: string;
  password?: string;
}
export interface IToggleActivation {
  ids: string[];
  state: boolean;
}
