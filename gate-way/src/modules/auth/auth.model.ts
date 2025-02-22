import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { EnumRoles } from '@src/bases/base';
import { Consts } from '@src/Utils/consts';

//#region Login
@ObjectType()
export class LoginModel {
  @Field(() => String, { name: 'userName', description: Consts.yourUserName })
  userName: string = '';

  @Field(() => String, { name: 'password', description: Consts.yourPassword })
  password: string = '';
}
//#endregion

//#region forgot password

@ObjectType()
export class ForgotPasswordModel {
  @Field(() => String, { name: 'userName', description: Consts.yourUserName })
  userName: string = '';
}
//#endregion

//#region get menu structure

@ObjectType()
export class MenuStructureModel {
  @Field(() => Int, {
    name: 'id',
  })
  id: number = 0;

  @Field(() => String, {
    name: 'link',
    description: Consts.menuLink,
    nullable: true,
  })
  link?: string = '';

  @Field(() => String, {
    name: 'name',
    description: Consts.menuName,
  })
  name: string = '';

  @Field(() => Int, {
    name: 'parentId',
    nullable: true,
    description: Consts.menuParentId,
  })
  parentId?: string[] = [];

  @Field(() => Boolean, {
    name: 'isreadOnly',
    description: Consts.yourUserName,
  })
  @Field(() => EnumRoles, {
    name: 'roles',
    description: Consts.yourUserName,
  })
  roles: Roles;
}
//#endregion

export class JwtPayLoad {
  userName: string;
  sub: string;
  roles: Roles[];
}

@ObjectType()
export class LoginResponse {
  @Field(() => String, {
    name: 'access_token',
    nullable: true,
    description: Consts.accessToken,
  })
  access_token: string;
  @Field(() => String, {
    name: 'refresh_token',
    nullable: true,
    description: Consts.refreshToken,
  })
  refresh_token: string;
}
