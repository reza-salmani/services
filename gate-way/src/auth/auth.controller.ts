import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ForgotPasswordDto, LoginDto } from 'src/auth/auth.model.dto';
import { ForgotPasswordModel, LoginResponse } from 'src/auth/auth.model';
import { PrismaAuthService } from './auth.prisma.service';
import { Consts } from 'src/Utils/consts';

@Resolver()
export class AuthResolver {
  constructor(private authService: PrismaAuthService) {}

  @Mutation(() => LoginResponse, { name: 'login' })
  async Login(
    @Args({ nullable: false, name: 'loginModel', type: () => LoginDto })
    loginModel: LoginDto,
  ) {
    return this.authService.Login(loginModel);
  }

  @Mutation(() => LoginResponse, { name: 'refreshToken' })
  async RefreshToken(@Context() ctx: Record<string, unknown>) {
    return this.authService.RefreshToken(ctx);
  }
  @Mutation(() => String, { name: 'logout' })
  async ServerSideLogout(@Context() ctx: Record<string, any>) {
    this.authService.serverSideLogout(ctx);
    return Consts.successfullyLogOut;
  }
  @Mutation(() => ForgotPasswordModel, { name: 'forgotPassword' })
  async ForgotPassword(
    @Args({
      nullable: false,
      name: 'forgotModel',
      type: () => ForgotPasswordDto,
    })
    forgotPasswordModel: ForgotPasswordDto,
  ) {
    this.authService.ForgotPassword(forgotPasswordModel);
  }
}
