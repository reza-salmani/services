import { Field, InputType } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { EnumRoles } from '@src/bases/base';
import { Consts } from '@src/Utils/consts';

//#region Login
@InputType()
export class LoginDto {
  @Field(() => String, { name: 'userName', description: Consts.yourUserName })
  userName: string = '';

  @Field(() => String, { name: 'password', description: Consts.yourPassword })
  password: string = '';
}
//#endregion

//#region forgot password

@InputType()
export class ForgotPasswordDto {
  @Field(() => String, { name: 'userName', description: Consts.yourUserName })
  userName: string = '';
  @Field(() => String, { name: 'password', description: Consts.yourPassword })
  password: string = '';
}
//#endregion

//#region manage pages in menu

@InputType()
export class AddPageDto {
  @Field(() => String, { name: 'name', description: Consts.menuName })
  name: string = '';
  @Field(() => String, { name: 'link', description: Consts.menuLink })
  link: string = '';
  @Field(() => String, { name: 'parentId', description: Consts.menuParentId })
  parentId: string;
  @Field(() => Boolean, { name: 'isReadOnly' })
  isReadOnly: boolean;
  @Field(() => [EnumRoles], { name: 'roles' })
  roles: Roles[];
}
export class UpdatePageDto extends AddPageDto {
  @Field(() => String, { name: 'id' })
  id: string = '';
}
//#endregion
