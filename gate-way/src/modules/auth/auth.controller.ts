import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PrismaAuthService } from './auth.prisma.service';
import {
  ForgotPasswordDto,
  LoginDto,
  UpdatePageRolesDto,
} from './auth.model.dto';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, HasRoles } from './jwt.strategy';
import {
  ForgotPasswordModel,
  LoginResponse,
  MenuStructureModel,
} from './auth.model';
import { Consts } from '@utils/consts';
import { Roles } from '@prisma/client';
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

  //#region-------------- updatePageRoles -----------------
  @UseGuards(GqlAuthGuard)
  @HasRoles([Roles.Demo, Roles.Admin, Roles.User_Global, Roles.User_Management])
  @Query(() => Number, { name: 'updatePageRoles' })
  async UpdatePageRoles(
    @Args({
      nullable: false,
      name: 'updatePageRolesModel',
      type: () => UpdatePageRolesDto,
    })
    updatePageRolesModel: UpdatePageRolesDto,
  ) {
    return await this.authService.UpdatePageRoles(updatePageRolesModel);
  }
  //#endregion

  //#region-------------- roles ---------------------------
  @UseGuards(GqlAuthGuard)
  @Query(() => [String], { name: 'roles' })
  async GetRoles() {
    return await this.authService.GetRoles();
  }
  //#endregion
}
