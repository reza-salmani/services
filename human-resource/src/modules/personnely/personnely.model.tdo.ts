export class PersonnelListDto {
  name: string;
  family: string;
  nationalCode: string;
  birthDate: string;
  activation: boolean;
  id: string;
}

export type CreatePersonnelDto = Omit<PersonnelListDto, 'id'>;
export type UpdatePersonnelDto = Partial<PersonnelListDto>;
export class TogglePersonnelDto {
  ids: string[];
  status: boolean;
}
