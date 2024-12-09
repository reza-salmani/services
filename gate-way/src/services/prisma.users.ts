import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma-client';
import { User } from '@prisma/client';

@Injectable()
export class PrismaUsersService {
  constructor(private prismaService: PrismaService) {}

  async GetAllUsersByQuery(queries: string) {
    console.log(queries);
    return this.prismaService.user
      .findMany(queries ? JSON.parse(queries) : {})
      .then();
  }

  async GetUserByQuery(query: string) {
    return this.prismaService.user
      .findUnique({ where: JSON.parse(query) })
      .then();
  }

  async CreateUser(user: User) {
    return this.prismaService.user.create({ data: user }).then();
  }

  async UpdateUser(user: User) {
    return this.prismaService.user
      .update({ data: user, where: { id: user.id } })
      .then();
  }

  async SoftDeleteUsers(ids: string[]) {
    this.prismaService.user.updateMany({
      data: { isDeleted: true },
      where: { id: { in: ids } },
    });
  }
}
