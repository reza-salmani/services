import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ForgotPasswordDto, LoginDto } from 'src/models/auth/authDto';
import { ForgotPasswordModel, LoginResponse } from 'src/models/auth/authModel';

@Resolver()
export class AuthResolver {
  constructor() {}

  @Mutation(() => LoginResponse, { name: 'login' })
  async Login(
    @Args({ nullable: false, name: 'loginModel', type: () => LoginDto })
    loginModel: LoginDto,
  ) {
    return '';
  }

  @Mutation(() => ForgotPasswordModel, { name: 'forgotPassword' })
  async ForgotPassword(
    @Args({
      nullable: false,
      name: 'forgotModel',
      type: () => ForgotPasswordDto,
    })
    loginModel: ForgotPasswordDto,
  ) {}
}
