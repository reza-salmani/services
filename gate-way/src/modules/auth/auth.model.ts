import { Field, ObjectType } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { Consts } from '@src/Utils/consts';

//#region Login
@ObjectType()
export class LoginModel {
  @Field(() => String, { name: 'username', description: Consts.yourUserName })
  userName: string = '';

  @Field(() => String, { name: 'password', description: Consts.yourPassword })
  password: string = '';
}
//#endregion

//#region forgot password

@ObjectType()
export class ForgotPasswordModel {
  @Field(() => String, { name: 'username', description: Consts.yourUserName })
  userName: string = '';
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
    description: Consts.accessToken,
  })
  access_token: string;
  @Field(() => String, {
    name: 'refresh_token',
    description: Consts.refreshToken,
  })
  refresh_token: string;
}
