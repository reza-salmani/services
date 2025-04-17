import { Field, InputType } from '@nestjs/graphql';
import { Consts } from '@utils/consts';

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
