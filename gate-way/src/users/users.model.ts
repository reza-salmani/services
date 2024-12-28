import { ObjectType, Field } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import {
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsStrongPassword,
} from 'class-validator';
import { Consts } from 'src/Utils/consts';
import { EnumRoles } from '../bases/base';

@ObjectType()
export class Users {
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
    nullable: false,
    name: 'Roles',
    description: Consts.Roles,
    defaultValue: [Roles.Guest],
  })
  roles: Roles[];
}
