import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateUserDto,
  DeleteUserDto,
  ToggleActiveUserDto,
  UpdateRolesToUserDto,
  UpdateUserDto,
} from './users.model.dto';
import { PrismaUsersService } from './users.prisma.service';
import { UseGuards } from '@nestjs/common';
import {
  GqlAuthGuard,
  HasNotRoles,
  HasRoles,
} from 'src/modules/auth/jwt.strategy';
import { EnumRoles, Counter } from '@src/bases/base';
import { PrismaQuery, PrismaSingleQuery } from '@src/bases/PrismaQuery';
import { Users } from './users.model';

//================================ Resulver ===================================
@UseGuards(GqlAuthGuard)
@Resolver(() => [Users])
export class UsersResolver {
  constructor(private prismaRequestService: PrismaUsersService) {}

  //================================== GetAllUsersByQuery ===========================
  @HasNotRoles([EnumRoles.Guest, EnumRoles.Accountant])
  @Query(() => [Users], { name: 'GetAllUsersWithQuery' })
  async GetUsersByQuery(
    @Args('queries', { nullable: true, type: () => PrismaQuery })
    query: PrismaQuery,
  ): Promise<Users[]> {
    return await this.prismaRequestService.GetAllUsersByQuery(query);
  }
  //================================== GetUserByQuery  ==============================
  @HasNotRoles([EnumRoles.Guest, EnumRoles.Accountant])
  @Query(() => Users, { name: 'getUserByQuery' })
  async GetUserByQuery(
    @Args('query', { nullable: true, type: () => PrismaSingleQuery })
    query: PrismaSingleQuery,
  ): Promise<Users> {
    return await this.prismaRequestService.GetUserByQuery(query);
  }

  //================================== CreateUser ==================================
  @HasRoles([EnumRoles.Admin, EnumRoles.Manager, EnumRoles.User])
  @Mutation(() => Users, { name: 'CreateUser' })
  // @UseRoles(EnumRoles.Admin, EnumRoles.User)
  async CreateUser(
    @Args({ nullable: false, name: 'userModel', type: () => CreateUserDto })
    userModel: CreateUserDto,
  ): Promise<Users> {
    return await this.prismaRequestService.CreateUser(userModel);
  }

  //================================= UpdateUser ==================================
  @HasRoles([EnumRoles.Admin, EnumRoles.Manager, EnumRoles.User])
  @Mutation(() => Users, { name: 'UpdateUser' })
  async UpdateUser(
    @Args({ nullable: false, name: 'userModel', type: () => UpdateUserDto })
    userModel: UpdateUserDto,
  ): Promise<Users> {
    return await this.prismaRequestService.UpdateUser(userModel);
  }

  //================================ SoftDeleteUsers ==============================
  @HasRoles([EnumRoles.Admin, EnumRoles.Manager, EnumRoles.User])
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

  //=============================== RevertDeletedUsers ============================
  @HasRoles([EnumRoles.Admin, EnumRoles.Manager])
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

  //=============================== HardDeleteUsers ===============================
  @HasRoles([EnumRoles.Admin, EnumRoles.Manager])
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

  //=============================== ChangeActivation ==============================
  @HasRoles([EnumRoles.Admin, EnumRoles.Manager, EnumRoles.User])
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

  //=============================== UpdateUserRoles ================================
  @HasRoles([EnumRoles.Admin, EnumRoles.Manager])
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
}
