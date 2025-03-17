import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { Consts } from '@utils/consts';

//#region  ------------------  Create User -------------------------------
@InputType()
export class CreateUserDto {
  @Field((type) => String, {
    nullable: false,
    name: 'nationalCode',
    description: Consts.yourNationalCode,
  })
  @IsNotEmpty()
  nationalCode: string;

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
    name: 'updateDate',
    description: Consts.updateDate,
  })
  updateDate: string;
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

  @Field(() => [Roles], {
    nullable: false,
    name: 'Roles',
    description: Consts.Roles,
    defaultValue: [Roles.Demo_Viewer],
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
