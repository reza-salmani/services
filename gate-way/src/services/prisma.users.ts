import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma-client';
import { PrismaQuery, PrismaSingleQuery } from 'src/models/PrismaQuery';
import {
  CreateUserDto,
  DeleteUserDto,
  ToggleActiveUserDto,
  UpdateRolesToUserDto,
  UpdateUserDto,
} from 'src/models/users/userDto';
import { User } from '@prisma/client';
import { Consts } from 'src/Utils/consts';
import { Tools } from 'src/Utils/tools';

@Injectable()
export class PrismaUsersService {
  constructor(private prismaService: PrismaService) {}

  async GetAllUsersByQuery(queries: PrismaQuery): Promise<User[]> {
    return await this.prismaService.user.findMany(queries);
  }

  async GetUserByQuery(query: PrismaSingleQuery): Promise<User> {
    return await this.prismaService.user.findFirst(query);
  }

  async CreateUser(user: CreateUserDto): Promise<User> {
    let existUser = await this.prismaService.user.findUnique({
      where: { userName: user.userName },
    });
    if (existUser) {
      new BadRequestException(Consts.Duplicated);
    } else {
      user.password = await Tools.hash(user.password);
      return await this.prismaService.user.create({
        data: { ...user, createDate: new Date().toISOString() },
      });
    }
  }

  async UpdateUser(user: UpdateUserDto): Promise<User> {
    user.updateDate = new Date().toISOString();
    let userResult: UpdateUserDto = JSON.parse(JSON.stringify(user));
    delete userResult.id;
    return await this.prismaService.user.update({
      data: userResult,
      where: { id: user.id },
    });
  }

  async SoftDeleteUsers(deleteUsers: DeleteUserDto) {
    return await this.prismaService.user.updateMany({
      data: { isDeleted: true, deleteDate: new Date().toISOString() },
      where: { id: { in: deleteUsers.ids } },
    });
  }

  async RevertDeletedUsers(deleteUsers: DeleteUserDto) {
    return await this.prismaService.user.updateMany({
      data: { isDeleted: false, revertDate: new Date().toISOString() },
      where: { id: { in: deleteUsers.ids } },
    });
  }

  async HardDeleteUsers(deleteUsers: DeleteUserDto) {
    return await this.prismaService.user.deleteMany({
      where: { id: { in: deleteUsers.ids } },
    });
  }

  async ChangeActivationUsers(activationUsers: ToggleActiveUserDto) {
    return await this.prismaService.user.updateMany({
      data: {
        isActive: activationUsers.state,
        updateDate: new Date().toISOString(),
      },
      where: { id: { in: activationUsers.ids } },
    });
  }
  async UpdateUserRoles(updateModel: UpdateRolesToUserDto) {
    return await this.prismaService.user.updateMany({
      data: {
        roles: updateModel.Roles,
        updateDate: new Date().toISOString(),
      },
      where: { id: { in: updateModel.ids } },
    });
  }
}
