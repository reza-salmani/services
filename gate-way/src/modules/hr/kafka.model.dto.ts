import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Consts } from '@utils/consts';

@InputType()
export class CreatePersonnelModelDto {
  @Field(() => String, {
    nullable: false,
    name: 'name',
    description: Consts.name,
  })
  name: string;

  @Field(() => String, {
    nullable: false,
    name: 'family',
    description: Consts.family,
  })
  family: string;

  @Field(() => String, {
    nullable: false,
    name: 'nationalCode',
    description: Consts.nationalCode,
  })
  nationalCode: string;

  @Field(() => Boolean, {
    nullable: false,
    name: 'activation',
    defaultValue: false,
    description: Consts.status,
  })
  activation: boolean = false;

  @Field(() => String, {
    nullable: false,
    name: 'birthDate',
    description: Consts.birthDate,
  })
  birthDate: string;
}

@InputType()
export class UpdatePersonnelDto extends PartialType(CreatePersonnelModelDto) {
  @Field(() => String, { name: 'id', nullable: false })
  id: string;
}
@InputType()
export class PersonnelListDto extends PartialType(UpdatePersonnelDto) {}

@InputType()
export class ToggleActivation {
  @Field(() => [String], { name: 'ids', nullable: false })
  ids: string[];
  @Field(() => Boolean, {
    name: 'status',
    nullable: false,
    defaultValue: false,
  })
  status: boolean = false;
}
