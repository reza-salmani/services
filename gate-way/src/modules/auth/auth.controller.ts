import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {
  ForgotPasswordModel,
  LoginResponse,
} from 'src/modules/auth/auth.model';
import { PrismaAuthService } from './auth.prisma.service';
import { Consts } from 'src/Utils/consts';
import { ForgotPasswordDto, LoginDto } from './auth.model.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: PrismaAuthService) {}

  //#region login
  @Mutation(() => LoginResponse, { name: 'login' })
  async Login(
    @Args({ nullable: false, name: 'loginModel', type: () => LoginDto })
    loginModel: LoginDto,
    @Context() context,
  ) {
    const jwt = await this.authService.Login(loginModel);
    const { res } = context;
    res.cookie('jwt', jwt.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'strict', // Adjust as per your requirements
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    return jwt;
  }
  //#endregion

  //#region
  @Mutation(() => LoginResponse, { name: 'refreshToken' })
  async RefreshToken(@Context() ctx: any) {
    return await this.authService.RefreshToken(ctx);
  }
  //#endregion

  //#region
  @Mutation(() => Boolean, { name: 'isAuth' })
  async IsAuthenticated(@Context() ctx: any) {
    return await this.authService.IsAuthenticated(ctx);
  }
  //#endregion

  //#region
  @Mutation(() => String, { name: 'logout' })
  async ServerSideLogout(@Context() ctx: Record<string, any>) {
    this.authService.serverSideLogout(ctx);
    return Consts.successfullyLogOut;
  }
  //#endregion

  //#region
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
  //#endregion
}
