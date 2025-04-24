export interface IPersonnel {
  id?: string;
  name: string;
  family: string;
  nationalCode: string;
  birthDate: Date;
  activation: boolean;
}
export interface IUpsertPersonnelForm extends Omit<IPersonnel, "id"> {}
export interface IUpsertPersonnel extends IPersonnel {}
