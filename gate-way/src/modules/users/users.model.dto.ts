import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';
import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { EnumRoles } from '@src/bases/base';
import { Consts } from '@src/Utils/consts';

//#region  ------------------  Create User -------------------------------
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
//#endregion

//#region -------------------- Update User --------------------------------
@InputType()
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'userName']),
) {
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

  @Field(() => [EnumRoles], {
    nullable: true,
    name: 'Roles',
    description: Consts.Roles,
    defaultValue: [Roles.Guest],
  })
  Roles: Roles[];
}
//#endregion

//#region ------------------------ Delete Users --------------------------
@InputType()
export class DeleteUserDto {
  @Field(() => [String], {
    nullable: false,
    name: 'ids',
    description: Consts.ids,
  })
  ids: string[];
}
//#endregion

//#region ------------------------- Toggle  Active Users --------------------------
@InputType()
export class ToggleActiveUserDto {
  @Field(() => [String], {
    nullable: false,
    name: 'ids',
    description: Consts.ids,
  })
  ids: string[];
  @Field(() => Boolean, { name: 'state', nullable: false, defaultValue: false })
  state: boolean;
}
//#endregion

//#region ---------------------------- Update Roles To User ---------------------------
@InputType()
export class UpdateRolesToUserDto {
  @Field(() => [String], {
    nullable: false,
    name: 'ids',
    description: Consts.ids,
  })
  ids: string[];

  @Field(() => [EnumRoles], {
    nullable: false,
    name: 'Roles',
    description: Consts.Roles,
    defaultValue: [Roles.Guest],
  })
  Roles: Roles[];
}
//#endregion

//#region ---------------------------- manage User Avatar ---------------------------
@InputType()
export class ManageAvatarUserDto {
  @Field(() => String, {
    nullable: true,
    name: 'avatarImage',
    description: Consts.avatarImage,
  })
  avatarImage?: string;

  @Field(() => String, {
    nullable: false,
    name: 'userId',
    description: Consts.userId,
  })
  userId: string;
}
//#endregion
