import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreateUserDto,
  DeleteUserDto,
  ToggleActiveUserDto,
  UpdateRolesToUserDto,
  UpdateUserDto,
} from './users.model.dto';
import { PrismaUsersService } from './users.prisma.service';
import { PrismaQuery, PrismaSingleQuery } from 'src/bases/PrismaQuery';
import { Users } from 'src/users/users.model';
import { Counter, EnumRoles } from 'src/bases/base';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard, HasNotRoles, HasRoles } from 'src/auth/jwt.strategy';
@UseGuards(GqlAuthGuard)
@Resolver(() => [Users])
export class UsersResolver {
  constructor(private prismaRequestService: PrismaUsersService) {}
  @HasNotRoles([EnumRoles.Guest])
  @Query(() => [Users], { name: 'userQueries' })
  async GetUsersByQuery(
    @Args('queries', { nullable: true, type: () => PrismaQuery })
    query: PrismaQuery,
  ): Promise<Users[]> {
    return await this.prismaRequestService.GetAllUsersByQuery(query);
  }

  @HasNotRoles([EnumRoles.Guest])
  @Query(() => Users, { name: 'userQuery' })
  async GetUserByQuery(
    @Args('query', { nullable: true, type: () => PrismaSingleQuery })
    query: PrismaSingleQuery,
  ): Promise<Users> {
    return await this.prismaRequestService.GetUserByQuery(query);
  }

  @HasRoles([EnumRoles.Admin, EnumRoles.Manager, EnumRoles.User])
  @Mutation(() => Users, { name: 'userModel' })
  // @UseRoles(EnumRoles.Admin, EnumRoles.User)
  async CreateUser(
    @Args({ nullable: false, name: 'userModel', type: () => CreateUserDto })
    userModel: CreateUserDto,
  ): Promise<Users> {
    return await this.prismaRequestService.CreateUser(userModel);
  }

  @HasRoles([EnumRoles.Admin, EnumRoles.Manager, EnumRoles.User])
  @Mutation(() => Users)
  async UpdateUser(
    @Args({ nullable: false, name: 'userModel', type: () => UpdateUserDto })
    userModel: UpdateUserDto,
  ): Promise<Users> {
    return await this.prismaRequestService.UpdateUser(userModel);
  }

  @HasRoles([EnumRoles.Admin, EnumRoles.Manager, EnumRoles.User])
  @Mutation(() => Counter)
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

  @HasRoles([EnumRoles.Admin, EnumRoles.Manager])
  @Mutation(() => Counter)
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

  @HasRoles([EnumRoles.Admin, EnumRoles.Manager])
  @Mutation(() => Counter)
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

  @HasRoles([EnumRoles.Admin, EnumRoles.Manager, EnumRoles.User])
  @Mutation(() => Counter)
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

  @HasRoles([EnumRoles.Admin, EnumRoles.Manager])
  @Mutation(() => Counter)
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
