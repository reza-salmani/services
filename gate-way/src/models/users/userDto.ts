import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';
import { Consts } from '../../Utils/consts';
import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Rules } from '@prisma/client';
import { EnumRules } from '../base';

@InputType()
export class CreateUserDto {
  @Field((type) => String, {
    nullable: false,
    name: 'firstName',
    description: Consts.yourRealName,
  })
  @IsNotEmpty()
  firstName: string;

  @Field((type) => String, {
    nullable: false,
    name: 'lastName',
    description: Consts.yourRealFamily,
  })
  @IsNotEmpty({ message: Consts.lastNameRequiredMessage })
  lastName: string;

  @Field((type) => String, {
    nullable: false,
    name: 'email',
    description: Consts.yourRealEmail,
  })
  @IsEmail()
  @IsNotEmpty({ message: Consts.emailRequiredMessage })
  email: string;

  @Field((type) => String, {
    nullable: false,
    name: 'phone',
    description: Consts.yourRealPhone,
  })
  @IsPhoneNumber('IR', { message: Consts.phoneRequiredMessage })
  phone: string;

  @Field((type) => String, {
    nullable: false,
    name: 'userName',
    description: Consts.yourUserName,
  })
  @IsNotEmpty({ message: Consts.usernameRequiredMessage })
  userName: string;

  @Field((type) => String, {
    nullable: false,
    name: 'password',
    description: Consts.yourPassword,
  })
  @IsStrongPassword({ minLength: 2 }, { message: Consts.minLengthOfPassword })
  @IsNotEmpty({ message: Consts.passwordRequiredMessage })
  password: string;
}

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field(() => String, {
    nullable: false,
    name: 'id',
    description: Consts.yourUserIdentifier,
  })
  @IsNotEmpty({ message: Consts.UserIdIsRequired })
  id: string;
  @Field(() => String, {
    nullable: true,
    name: 'createDate',
    description: Consts.createDate,
  })
  createDate: string;
  @Field(() => String, {
    nullable: true,
    name: 'updateDate',
    description: Consts.updateDate,
  })
  updateDate: string;
  @Field(() => String, {
    nullable: true,
    name: 'deleteDate',
    description: Consts.deleteDate,
  })
  deleteDate: string;
  @Field(() => String, {
    nullable: true,
    name: 'revertDate',
    description: Consts.revertDate,
  })
  revertDate: string;
  @Field(() => Boolean, {
    nullable: true,
    name: 'isActive',
    description: Consts.isActive,
  })
  isActive: boolean;
  @Field(() => Boolean, {
    nullable: true,
    name: 'isDeleted',
    description: Consts.isDeleted,
  })
  isDeleted: boolean;

  @Field(() => [EnumRules], {
    nullable: true,
    name: 'rules',
    description: Consts.rules,
    defaultValue: [Rules.Guest],
  })
  rules: Rules[];
}

@InputType()
export class DeleteUserDto {
  @Field(() => [String], {
    nullable: false,
    name: 'ids',
    description: Consts.ids,
  })
  ids: string[];
}

@InputType()
export class ActiveUserDto {
  @Field(() => [String], {
    nullable: false,
    name: 'ids',
    description: Consts.ids,
  })
  ids: string[];
  @Field(() => Boolean, { name: 'state', nullable: false, defaultValue: false })
  state: boolean;
}

@InputType()
export class AddRulesToUserDto {
  @Field(() => [String], {
    nullable: false,
    name: 'ids',
    description: Consts.ids,
  })
  ids: string[];

  @Field(() => [EnumRules], {
    nullable: false,
    name: 'rules',
    description: Consts.rules,
    defaultValue: [Rules.Guest],
  })
  rules: Rules[];
}
