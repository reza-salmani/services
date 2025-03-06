import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ForgotPasswordModel,
  LoginResponse,
  MenuStructureModel,
} from 'src/modules/auth/auth.model';
import { PrismaAuthService } from './auth.prisma.service';
import { Consts } from 'src/Utils/consts';
import { ForgotPasswordDto, LoginDto } from './auth.model.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './jwt.strategy';
@Resolver()
export class AuthResolver {
  constructor(private authService: PrismaAuthService) {}

  //#region-------------- login ---------------------------
  @Mutation(() => LoginResponse, { name: 'login' })
  async Login(
    @Args({ nullable: false, name: 'loginModel', type: () => LoginDto })
    loginModel: LoginDto,
    @Context() context,
  ) {
    return await this.authService.Login(loginModel, context);
  }
  //#endregion

  //#region-------------- IsAuthenticated -----------------
  @Mutation(() => Boolean, { name: 'isAuth' })
  async IsAuthenticated(@Context() ctx: any) {
    return await this.authService.IsAuthenticated(ctx);
  }
  //#endregion

  //#region-------------- logout --------------------------
  @Mutation(() => String, { name: 'logout' })
  async Logout(@Context() ctx: any) {
    await this.authService.Logout(ctx);
    return Consts.successfullyLogOut;
  }
  //#endregion

  //#region-------------- forgotPassword ------------------
  @Mutation(() => ForgotPasswordModel, { name: 'forgotPassword' })
  async ForgotPassword(
    @Args({
      nullable: false,
      name: 'forgotModel',
      type: () => ForgotPasswordDto,
    })
    forgotPasswordModel: ForgotPasswordDto,
  ) {
    return await this.authService.ForgotPassword(forgotPasswordModel);
  }
  //#endregion

  //#region-------------- MenuBar -------------------------
  @UseGuards(GqlAuthGuard)
  @Query(() => [MenuStructureModel], { name: 'menu' })
  async MenuBar(@Context() context: any) {
    return await this.authService.GetPages(context);
  }
  //#endregion

  //#region-------------- roles ---------------------------
  @UseGuards(GqlAuthGuard)
  @Query(() => [MenuStructureModel], { name: 'menu' })
  async GetRoles(@Context() context: any) {
    return await this.authService.GetPages(context);
  }
  //#endregion
}
