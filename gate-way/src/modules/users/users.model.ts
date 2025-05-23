import { ObjectType, Field } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { Consts } from '@utils/consts';
import {
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';

//#region --------------------- Users ---------------------
@ObjectType()
export class Users {
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
  @IsStrongPassword({ minLength: 2 }, { message: Consts.minLengthOfPassword })
  @IsNotEmpty({ message: Consts.passwordRequiredMessage })
  password: string;

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
  updateDate?: string;

  @Field(() => String, {
    nullable: true,
    name: 'deleteDate',
    description: Consts.deleteDate,
  })
  deleteDate?: string;

  @Field(() => String, {
    nullable: true,
    name: 'revertDate',
    description: Consts.revertDate,
  })
  revertDate: string;

  @Field(() => String, {
    nullable: true,
    name: 'avatarPath',
    description: Consts.avatarPath,
  })
  avatarPath?: string;

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

  @Field(() => [Roles], {
    nullable: false,
    name: 'roles',
    description: Consts.Roles,
    defaultValue: [Roles.Demo_Viewer],
  })
  roles?: Roles[];

  @Field(() => [String], {
    nullable: false,
    name: 'permittedPage',
    description: Consts.permittedPage,
  })
  permittedPage?: String[];
}
//#endregion
