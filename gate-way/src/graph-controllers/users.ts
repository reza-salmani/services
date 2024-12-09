import { Args, Query, Resolver } from '@nestjs/graphql';
import { Users } from '../models/UserDto';
import { PrismaUsersService } from '../services/prisma.users';
import { User } from '@prisma/client';

@Resolver(() => [Users])
export class UsersResolver {
  constructor(private prismaRequestService: PrismaUsersService) {}
  @Query(() => [Users], { name: 'userQuery' })
  async GetUsersByQuery(
    @Args('query', { nullable: true }) query: string,
  ): Promise<User[]> {
    return this.prismaRequestService.GetAllUsersByQuery(query);
  }
}
