import { Field, InputType } from '@nestjs/graphql';
import { Consts } from 'src/Utils/consts';

//#region Login
@InputType()
export class LoginDto {
  @Field(() => String, { name: 'username', description: Consts.yourUserName })
  userName: string = '';

  @Field(() => String, { name: 'password', description: Consts.yourPassword })
  password: string = '';
}
//#endregion

//#region forgot password

@InputType()
export class ForgotPasswordDto {
  @Field(() => String, { name: 'username', description: Consts.yourUserName })
  userName: string = '';
}
//#endregion
