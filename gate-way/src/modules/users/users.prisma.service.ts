import { Roles, User } from '@prisma/client';
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
import { UserOutput } from './users.model';
import { PrismaQuery, PrismaSingleQuery } from '@base/PrismaQuery';
import { GraphQlBadRequestException } from '@base/services/error-handler';
import { PrismaService } from '@base/services/prisma-client';
import { Consts } from '@utils/consts';
import { Tools } from '@utils/tools';

@Injectable()
export class PrismaUsersService {
  constructor(
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  //#region ------------- GetAllUsersByQuery --------------
  async GetAllUsersByQuery(queries: PrismaQuery): Promise<UserOutput> {
    return {
      items: await this.prismaService.user.findMany(queries),
      pageNumber: queries.skip,
      pageSize: queries.take,
      totalCount: await this.prismaService.user.count(),
    };
  }
  //#endregion

  //#region ------------- GetUserByQuery ------------------
  async GetUserByQuery(query: PrismaSingleQuery): Promise<User> {
    return this.prismaService.user.findFirst(query);
  }
  //#endregion

  //#region ------------- CreateUser ----------------------
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
  //#endregion

  //#region ------------- UpdateUser ----------------------
  async UpdateUser(user: UpdateUserDto): Promise<User> {
    user.updateDate = new Date().toISOString();
    let userResult: UpdateUserDto = JSON.parse(JSON.stringify(user));
    return await this.prismaService.user.update({
      data: userResult,
      where: { id: user.id },
    });
  }
  //#endregion

  //#region ------------- SoftDeleteUsers -----------------
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
  //#endregion

  //#region ------------- RevertDeletedUsers --------------
  async RevertDeletedUsers(deleteUsers: DeleteUserDto) {
    return this.prismaService.user.updateMany({
      data: { isDeleted: false, revertDate: new Date().toISOString() },
      where: { id: { in: deleteUsers.ids } },
    });
  }
  //#endregion

  //#region ------------- HardDeleteUsers -----------------
  async HardDeleteUsers(deleteUsers: DeleteUserDto) {
    return this.prismaService.user.deleteMany({
      where: { id: { in: deleteUsers.ids } },
    });
  }
  //#endregion

  //#region ------------- ChangeActivationUsers -----------
  async ChangeActivationUsers(activationUsers: ToggleActiveUserDto) {
    return this.prismaService.user.updateMany({
      data: {
        isActive: activationUsers.state,
        updateDate: new Date().toISOString(),
      },
      where: { id: { in: activationUsers.ids } },
    });
  }
  //#endregion

  //#region ------------- UpdateUserRoles -----------------
  async UpdateUserRoles(updateModel: UpdateRolesToUserDto) {
    return this.prismaService.user.updateMany({
      data: {
        roles: updateModel.Roles,
        updateDate: new Date().toISOString(),
      },
      where: { id: { in: updateModel.ids } },
    });
  }
  //#endregion

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
  //#endregion

  //#region ------------- User Info -----------------------
  async GetUserInfo(context: any) {
    let userAuth = await Tools.GetUserInfoFromContext(
      context,
      this.jwtService,
      this.prismaService,
    );

    return await this.prismaService.user.findUnique({
      where: { id: userAuth.userId },
    });
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
