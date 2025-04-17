import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaAuthService } from './auth.prisma.service';
import { ForgotPasswordDto, LoginDto } from './auth.model.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './jwt.strategy';
import {
  ForgotPasswordModel,
  LoginResponse,
  MenuStructureModel,
} from './auth.model';
import { Consts } from '@utils/consts';
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
  @Query(() => [String], { name: 'roles' })
  async GetRoles() {
    return await this.authService.GetRoles();
  }
  //#endregion

  //#region-------------- check writable ------------------
  @UseGuards(GqlAuthGuard)
  @Query(() => Boolean, {
    name: 'checkWritable',
    nullable: false,
    description: Consts.checkWritable,
  })
  async CheckWritable(
    @Args({ name: 'menuName', nullable: false, type: () => String })
    inputModel: string,
    @Context() context: any,
  ) {
    return await this.authService.CheckWritable(inputModel, context);
  }
  //#endregion
}
