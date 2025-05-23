import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateUserDto,
  DeleteUserDto,
  FileUploadDto,
  ManagePermittedPagesDto,
  ToggleActiveUserDto,
  UpdateRolesToUserDto,
  UpdateUserDto,
} from './users.model.dto';
import { PrismaUsersService } from './users.prisma.service';
import { UseGuards } from '@nestjs/common';
import { Users } from './users.model';
import { Roles } from '@prisma/client';
import { Counter, UserOutput } from '@base/base';
import { PrismaQuery, PrismaSingleQuery } from '@base/PrismaQuery';
import { GqlAuthGuard, HasRoles } from '@auth/jwt.strategy';

@UseGuards(GqlAuthGuard)
@Resolver(() => [Users])
export class UsersResolver {
  constructor(private prismaRequestService: PrismaUsersService) {}

  //#region ------------- GetAllUsersByQuery --------------
  @HasRoles([
    Roles.Demo,
    Roles.Demo_Viewer,
    Roles.Admin,
    Roles.User_Global,
    Roles.User_Management,
    Roles.Inspector,
    Roles.Inspector_Viewer,
    Roles.Security,
    Roles.Security_Viewer,
  ])
  @Query(() => UserOutput, { name: 'GetAllUsersWithQuery' })
  async GetUsersByQuery(
    @Args('queries', { nullable: true, type: () => PrismaQuery })
    query: PrismaQuery,
  ): Promise<UserOutput> {
    return await this.prismaRequestService.GetAllUsersByQuery(query);
  }
  //#endregion

  //#region ------------- GetUserByQuery ------------------
  @HasRoles([
    Roles.Demo,
    Roles.Demo_Viewer,
    Roles.Admin,
    Roles.User_Global,
    Roles.User_Management,
    Roles.Inspector,
    Roles.Inspector_Viewer,
    Roles.Security,
    Roles.Security_Viewer,
  ])
  @Query(() => Users, { name: 'getUserByQuery' })
  async GetUserByQuery(
    @Args('query', { nullable: true, type: () => PrismaSingleQuery })
    query: PrismaSingleQuery,
  ): Promise<Users> {
    return await this.prismaRequestService.GetUserByQuery(query);
  }
  //#endregion

  //#region ------------- CreateUser ----------------------
  @HasRoles([
    Roles.Demo,
    Roles.Admin,
    Roles.User_Global,
    Roles.User_Management,
    Roles.Inspector,
    Roles.Security,
  ])
  @Mutation(() => Users, { name: 'CreateUser' })
  async CreateUser(
    @Args({ nullable: false, name: 'userModel', type: () => CreateUserDto })
    userModel: CreateUserDto,
  ): Promise<Users> {
    return await this.prismaRequestService.CreateUser(userModel);
  }
  //#endregion

  //#region ------------- UpdateUser ----------------------
  @HasRoles([
    Roles.Demo,
    Roles.Admin,
    Roles.User_Global,
    Roles.User_Management,
    Roles.Inspector,
    Roles.Security,
  ])
  @Mutation(() => Users, { name: 'UpdateUser' })
  async UpdateUser(
    @Args({ nullable: false, name: 'userModel', type: () => UpdateUserDto })
    userModel: UpdateUserDto,
  ): Promise<Users> {
    return await this.prismaRequestService.UpdateUser(userModel);
  }
  //#endregion

  //#region ------------- SoftDeleteUsers -----------------
  @HasRoles([
    Roles.Demo,
    Roles.Admin,
    Roles.User_Global,
    Roles.User_Management,
    Roles.Inspector,
    Roles.Security,
  ])
  @Mutation(() => Counter, { name: 'DeleteUsers' })
  async SoftDeleteUsers(
    @Args({
      nullable: false,
      name: 'deleteUsersIds',
      type: () => DeleteUserDto,
    })
    deletedUsers: DeleteUserDto,
  ) {
    return await this.prismaRequestService.SoftDeleteUsers(deletedUsers);
  }
  //#endregion

  //#region ------------- RevertDeletedUsers --------------
  @HasRoles([Roles.Demo, Roles.Admin, Roles.User_Global, Roles.User_Management])
  @Mutation(() => Counter, { name: 'RevertUsers' })
  async RevertDeletedUsers(
    @Args({
      nullable: false,
      name: 'deleteUsersIds',
      type: () => DeleteUserDto,
    })
    deletedUsers: DeleteUserDto,
  ) {
    return await this.prismaRequestService.RevertDeletedUsers(deletedUsers);
  }
  //#endregion

  //#region ------------- HardDeleteUsers -----------------
  @HasRoles([Roles.Demo, Roles.Admin, Roles.User_Global, Roles.User_Management])
  @Mutation(() => Counter, { name: 'DeleteUserPermanently' })
  async HardDeleteUsers(
    @Args({
      nullable: false,
      name: 'deleteUsersIds',
      type: () => DeleteUserDto,
    })
    deletedUsers: DeleteUserDto,
  ) {
    return await this.prismaRequestService.HardDeleteUsers(deletedUsers);
  }
  //#endregion

  //#region ------------- ChangeActivation ----------------
  @HasRoles([Roles.Demo, Roles.Admin, Roles.User_Global, Roles.User_Management])
  @Mutation(() => Counter, { name: 'ChangeActivation' })
  async ChangeActivation(
    @Args({
      nullable: false,
      name: 'ToggleActiveUser',
      type: () => ToggleActiveUserDto,
    })
    activationUsersIds: ToggleActiveUserDto,
  ) {
    return await this.prismaRequestService.ChangeActivationUsers(
      activationUsersIds,
    );
  }
  //#endregion

  //#region ------------- UpdateUserRoles -----------------
  @HasRoles([Roles.Demo, Roles.Admin, Roles.User_Global, Roles.User_Management])
  @Mutation(() => Counter, { name: 'UpdateUserRoles' })
  async UpdateUserRoles(
    @Args({
      nullable: false,
      name: 'UpdateRolesToUser',
      type: () => UpdateRolesToUserDto,
    })
    activationUsers: UpdateRolesToUserDto,
  ) {
    return await this.prismaRequestService.UpdateUserRoles(activationUsers);
  }
  //#endregion

  //#region ------------- updateUserPagePermission -----------------
  @HasRoles([Roles.Demo, Roles.Admin, Roles.User_Global, Roles.User_Management])
  @Mutation(() => Counter, { name: 'UpdateUserPagePermission' })
  async UpdateUserPagePermission(
    @Args({
      nullable: false,
      name: 'UpdatePagePermissionToUser',
      type: () => ManagePermittedPagesDto,
    })
    permissionUsers: ManagePermittedPagesDto,
  ) {
    return await this.prismaRequestService.UpdateUserPagePermission(
      permissionUsers,
    );
  }
  //#endregion

  //#region-------------- get User Info -------------------
  @Query(() => Users, { name: 'getUserInfo' })
  async GetUserInfo(@Context() context: any) {
    return await this.prismaRequestService.GetUserInfo(context);
  }
  //#endregion

  //#region-------------- hasPermission -------------------
  @Query(() => Boolean, { name: 'hasPermission' })
  async HasUserActionPermission(@Context() context: any) {
    let reuslt =
      await this.prismaRequestService.HasUserActionPermission(context);
    return reuslt;
  }
  //#endregion

  //#region-------------- upsertUserAvatar-----------------
  @HasRoles([Roles.Demo, Roles.Admin, Roles.User_Global, Roles.User_Management])
  @Mutation(() => Boolean, { name: 'UpsertUserAvatar' })
  async UpsertUserAvatar(
    @Args('fileItem', { type: () => FileUploadDto }) fileItem: FileUploadDto,
  ) {
    return await this.prismaRequestService.UpsertUserAvatar(fileItem);
  }

  //#endregion
}
