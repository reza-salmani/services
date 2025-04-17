import { Field, ObjectType } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { Consts } from '@utils/consts';

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
  @Field(() => String, {
    name: 'id',
    nullable: true,
  })
  id?: string;

  @Field(() => String, {
    name: 'link',
    description: Consts.menuLink,
    nullable: true,
  })
  link?: string = '';

  @Field(() => String, {
    name: 'name',
    description: Consts.menuName,
    nullable: true,
  })
  name?: string = '';

  @Field(() => String, {
    name: 'description',
    description: Consts.menuDescription,
    nullable: true,
  })
  description?: string = '';

  @Field(() => String, {
    name: 'persianName',
    description: Consts.menuPersianName,
    nullable: true,
  })
  persianName?: string;

  @Field(() => String, {
    name: 'parentId',
    nullable: true,
    description: Consts.menuParentId,
  })
  parentId?: string;

  @Field(() => MenuStructureModel, {
    name: 'parent',
    nullable: true,
    description: Consts.menuParent,
  })
  parent?: MenuStructureModel;

  @Field(() => Boolean, {
    name: 'isReadOnly',
    nullable: true,
  })
  isReadOnly?: boolean;

  @Field(() => [MenuStructureModel], {
    name: 'children',
    description: Consts.menuChildren,
    nullable: true,
  })
  children?: MenuStructureModel[];
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
