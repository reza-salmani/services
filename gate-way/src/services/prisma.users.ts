import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma-client';
import { User } from '@prisma/client';
import { PrismaQuery, PrismaSingleQuery } from 'src/models/PrismaQuery';

@Injectable()
export class PrismaUsersService {
  constructor(private prismaService: PrismaService) {}

  async GetAllUsersByQuery(queries: PrismaQuery) {
    return this.prismaService.user.findMany(queries).then();
  }

  async GetUserByQuery(query: PrismaSingleQuery) {
    return this.prismaService.user.findFirst(query).then();
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
