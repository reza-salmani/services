import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ActiveUserDto,
  CreateUserDto,
  DeleteUserDto,
  UpdateUserDto,
} from '../models/users/userDto';
import { PrismaUsersService } from '../services/prisma.users';
import { PrismaQuery, PrismaSingleQuery } from 'src/models/PrismaQuery';
import { Users } from 'src/models/users/userModel';
import { Counter } from 'src/models/base';

@Resolver(() => [Users])
export class UsersResolver {
  constructor(private prismaRequestService: PrismaUsersService) {}

  @Query(() => [Users], { name: 'userQueries' })
  async GetUsersByQuery(
    @Args('queries', { nullable: true, type: () => PrismaQuery })
    query: PrismaQuery,
  ): Promise<Users[]> {
    return await this.prismaRequestService.GetAllUsersByQuery(query);
  }

  @Query(() => Users, { name: 'userQuery' })
  async GetUserByQuery(
    @Args('query', { nullable: true, type: () => PrismaSingleQuery })
    query: PrismaSingleQuery,
  ): Promise<Users> {
    return await this.prismaRequestService.GetUserByQuery(query);
  }

  @Mutation(() => Users, { name: 'userModel' })
  async CreateUser(
    @Args({ nullable: false, name: 'userModel', type: () => CreateUserDto })
    userModel: CreateUserDto,
  ): Promise<Users> {
    return await this.prismaRequestService.CreateUser(userModel);
  }

  @Mutation(() => Users)
  async UpdateUser(
    @Args({ nullable: false, name: 'userModel', type: () => UpdateUserDto })
    userModel: UpdateUserDto,
  ): Promise<Users> {
    return await this.prismaRequestService.UpdateUser(userModel);
  }

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

  @Mutation(() => Counter)
  async ChangeActivation(
    @Args({
      nullable: false,
      name: 'activationUsersIds',
      type: () => ActiveUserDto,
    })
    activationUsersIds: ActiveUserDto,
  ) {
    return await this.prismaRequestService.ChangeActivationUsers(
      activationUsersIds,
    );
  }
}
