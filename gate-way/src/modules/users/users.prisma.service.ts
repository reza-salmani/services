import { Roles, User } from '@prisma/client';
import { PrismaQuery, PrismaSingleQuery } from '@src/bases/PrismaQuery';
import { PrismaService } from '@src/bases/services/prisma-client';
import { Consts } from '@src/Utils/consts';
import { Tools } from '@src/Utils/tools';
import {
  CreateUserDto,
  UpdateUserDto,
  DeleteUserDto,
  ToggleActiveUserDto,
  UpdateRolesToUserDto,
} from './users.model.dto';
import { JwtService } from '@nestjs/jwt';
import path, { join } from 'path';
import { createWriteStream, mkdirSync } from 'fs';
import { FileUpload } from 'graphql-upload-ts';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { GraphQlBadRequestException } from '@src/bases/services/error-handler';
import { UserOutput } from './users.model';

@Injectable()
export class PrismaUsersService {
  constructor(
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  //========================= GetAllUsersByQuery ============================
  async GetAllUsersByQuery(queries: PrismaQuery): Promise<UserOutput> {
    return {
      items: await this.prismaService.user.findMany(queries),
      pageNumber: queries.skip,
      pageSize: queries.take,
      totalCount: await this.prismaService.user.count(),
    };
  }

  //========================= GetUserByQuery ================================
  async GetUserByQuery(query: PrismaSingleQuery): Promise<User> {
    return this.prismaService.user.findFirst(query);
  }

  //======================== CreateUser =====================================
  async CreateUser(user: CreateUserDto): Promise<User> {
    let existUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { userName: user.userName },
          { email: user.email },
          { phone: user.phone },
          { nationalCode: user.nationalCode },
        ],
      },
    });
    if (existUser) {
      throw new GraphQlBadRequestException(
        Consts.Duplicated,
        HttpStatus.CONFLICT,
      );
    } else {
      user.password = await Tools.hash(user.password);
      return this.prismaService.user.create({
        data: { ...user, createDate: new Date().toISOString() },
      });
    }
  }

  //======================== UpdateUser =====================================
  async UpdateUser(user: UpdateUserDto): Promise<User> {
    user.updateDate = new Date().toISOString();
    let userResult: UpdateUserDto = JSON.parse(JSON.stringify(user));
    delete userResult.id;
    return this.prismaService.user.update({
      data: userResult,
      where: { id: user.id },
    });
  }

  //======================== SoftDeleteUsers ================================
  async SoftDeleteUsers(deleteUsers: DeleteUserDto) {
    let FindAdminFromIds = await this.prismaService.user.findMany({
      where: { AND: { id: { in: deleteUsers.ids }, roles: { has: 'Admin' } } },
    });
    if (FindAdminFromIds.length) {
      throw new GraphQlBadRequestException(
        Consts.youCanNotRemoveAdminUsers,
        HttpStatus.FORBIDDEN,
      );
    }
    return this.prismaService.user.updateMany({
      data: { isDeleted: true, deleteDate: new Date().toISOString() },
      where: { id: { in: deleteUsers.ids } },
    });
  }

  //======================== RevertDeletedUsers =============================
  async RevertDeletedUsers(deleteUsers: DeleteUserDto) {
    return this.prismaService.user.updateMany({
      data: { isDeleted: false, revertDate: new Date().toISOString() },
      where: { id: { in: deleteUsers.ids } },
    });
  }

  //======================== HardDeleteUsers ================================
  async HardDeleteUsers(deleteUsers: DeleteUserDto) {
    return this.prismaService.user.deleteMany({
      where: { id: { in: deleteUsers.ids } },
    });
  }

  //======================== ChangeActivationUsers ==========================
  async ChangeActivationUsers(activationUsers: ToggleActiveUserDto) {
    return this.prismaService.user.updateMany({
      data: {
        isActive: activationUsers.state,
        updateDate: new Date().toISOString(),
      },
      where: { id: { in: activationUsers.ids } },
    });
  }

  //======================= UpdateUserRoles =================================
  async UpdateUserRoles(updateModel: UpdateRolesToUserDto) {
    return this.prismaService.user.updateMany({
      data: {
        roles: updateModel.Roles,
        updateDate: new Date().toISOString(),
      },
      where: { id: { in: updateModel.ids } },
    });
  }

  //#region ------------- UserAvatarManager ---------------
  async ManageUserAvatar(fileUpload: FileUpload, context: any) {
    try {
      if (context.req && context.req.cookies && context.req.cookies['jwt']) {
        let userId = this.jwtService.decode(context.req.cookies['jwt']).sub;
        if (!userId) {
          throw new NotFoundException(Consts.userNotExist);
        }
        let localPath = path.dirname(join(__dirname, '/images/users/avatars'));
        if (!localPath) {
          mkdirSync(join(__dirname, '/images/users/avatars'), {
            recursive: true,
          });
        }
        localPath.concat(`/${userId}`);
        fileUpload.createReadStream().pipe(createWriteStream(localPath));
        return await this.prismaService.user.update({
          data: {
            avatarPath: localPath,
          },
          where: { id: userId },
        });
      }
    } catch (error) {}
  }

  //#region ------------- User Info -----------------------
  async GetUserInfo(context: any) {
    return await Tools.GetUserInfoFromContext(
      context,
      this.jwtService,
      this.prismaService,
    );
  }
  //#endregion

  //#region ------------- has Permission -----------------------
  async HasUserActionPermission(context: any) {
    const headerInfo = this.jwtService.decode(
      context.req.cookies['jwt'].trim(),
    );
    let userRoles = await this.prismaService.user.findFirst({
      where: { id: headerInfo.sub },
    });
    return Tools.matchs(userRoles.roles, [
      Roles.Admin,
      Roles.User_Management,
      Roles.User_Global,
      Roles.Demo,
    ]);
  }
  //#endregion
}
