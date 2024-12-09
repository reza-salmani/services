import { Args, Query, Resolver } from '@nestjs/graphql';
import { Users } from '../models/UserDto';
import { PrismaUsersService } from '../services/prisma.users';
import { User } from '@prisma/client';
import { PrismaQuery, PrismaSingleQuery } from 'src/models/PrismaQuery';

@Resolver(() => [Users])
export class UsersResolver {
  constructor(private prismaRequestService: PrismaUsersService) {}
  @Query(() => [Users], { name: 'userQueries' })
  async GetUsersByQuery(
    @Args('queries', { nullable: true, type: () => PrismaQuery })
    query: PrismaQuery,
  ): Promise<User[]> {
    return this.prismaRequestService.GetAllUsersByQuery(query);
  }

  @Query(() => Users, { name: 'userQuery' })
  async GetUserByQuery(
    @Args('query', { nullable: true, type: () => PrismaSingleQuery })
    query: PrismaSingleQuery,
  ): Promise<User> {
    return this.prismaRequestService.GetUserByQuery(query);
  }
}
