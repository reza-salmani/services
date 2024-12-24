import { Field, ObjectType } from '@nestjs/graphql';
import { Consts } from 'src/Utils/consts';

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
}

@ObjectType()
export class LoginResponse {
  @Field(() => String, {
    name: 'access_token',
    description: Consts.accessToken,
  })
  access_token: string;
}
