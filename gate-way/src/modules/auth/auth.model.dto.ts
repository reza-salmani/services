import { Field, InputType } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
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
export class UpdatePageRolesDto {
  @Field(() => String, { name: 'id' })
  id: string = '';
  @Field(() => [Roles], { name: 'roles' })
  roles: Roles[];
}
//#endregion
