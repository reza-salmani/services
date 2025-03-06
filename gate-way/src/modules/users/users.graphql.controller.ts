import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateUserDto,
  DeleteUserDto,
  ToggleActiveUserDto,
  UpdateRolesToUserDto,
  UpdateUserDto,
} from './users.model.dto';
import { PrismaUsersService } from './users.prisma.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, HasRoles } from 'src/modules/auth/jwt.strategy';
import { Counter } from '@src/bases/base';
import { PrismaQuery, PrismaSingleQuery } from '@src/bases/PrismaQuery';
import { UserOutput, Users } from './users.model';
import { FileUpload } from 'graphql-upload-ts';
import { Roles } from '@prisma/client';

//================================ Resulver ===================================
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

  //#region ------------- ManageUserAvatar ----------------
  @HasRoles([Roles.Demo, Roles.Admin, Roles.User_Global, Roles.User_Management])
  @Mutation(() => String, { name: 'manageUserAvatar' })
  async ManageUserAvatar(
    @Context() context: any,
    @Args({ nullable: false, name: 'MangeUserAvatar', type: () => String })
    fileUpload: FileUpload,
  ) {
    return await this.prismaRequestService.ManageUserAvatar(
      fileUpload,
      context,
    );
  }
  //#endregion
}
