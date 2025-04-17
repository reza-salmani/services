import { Roles, User } from '@prisma/client';
import {
  CreateUserDto,
  UpdateUserDto,
  DeleteUserDto,
  ToggleActiveUserDto,
  UpdateRolesToUserDto,
  ManagePermittedPagesDto,
  FileUploadDto,
} from './users.model.dto';
import { JwtService } from '@nestjs/jwt';
import { join } from 'path';
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  unlink,
} from 'fs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaQuery, PrismaSingleQuery } from '@base/PrismaQuery';
import { GraphQlBadRequestException } from '@base/services/error-handler';
import { PrismaService } from '@base/services/prisma-client';
import { Consts } from '@utils/consts';
import { Tools } from '@utils/tools';
import { UserOutput } from '@base/base';

@Injectable()
export class PrismaUsersService {
  constructor(
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  //#region ------------- GetAllUsersByQuery --------------
  async GetAllUsersByQuery(queries: PrismaQuery): Promise<UserOutput> {
    let result = await this.prismaService.user.findMany(queries);
    result.map((res) => {
      if (res.avatarPath) {
        res.avatarPath = `data:image/jpeg;base64,${readFileSync(res.avatarPath).toString('base64')}`;
      }
      return res;
    });
    return {
      items: result,
      pageNumber: queries.skip,
      pageSize: queries.take,
      totalCount: await this.prismaService.user.count(),
    };
  }
  //#endregion

  //#region ------------- GetUserByQuery ------------------
  async GetUserByQuery(query: PrismaSingleQuery): Promise<User> {
    let result = await this.prismaService.user.findFirst(query);
    if (result.avatarPath) {
      result.avatarPath = `data:image/jpeg;base64,${readFileSync(result.avatarPath).toString('base64')}`;
    }
    return result;
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
    delete userResult.id;
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

  //#region ------------- UpdateUserPagePermission -----------------
  async UpdateUserPagePermission(updateModel: ManagePermittedPagesDto) {
    return await this.prismaService.user.update({
      data: {
        permittedPage: updateModel.pageIds,
        updateDate: new Date().toISOString(),
      },
      where: {
        id: updateModel.userId,
      },
    });
  }
  //#endregion

  //#region ------------- User Info -----------------------
  async GetUserInfo(context: any) {
    let userAuth = await Tools.GetUserInfoFromContext(
      context,
      this.jwtService,
      this.prismaService,
    );
    let result = await this.prismaService.user.findUnique({
      where: { id: userAuth.userId },
    });
    if (result.avatarPath) {
      result.avatarPath = `data:image/jpeg;base64,${readFileSync(result.avatarPath).toString('base64')}`;
    }
    return result;
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

  //#region ------------- upsertUserAvatar ----------------
  async UpsertUserAvatar(fileItem: FileUploadDto) {
    if (!fileItem.userId) {
      throw new GraphQlBadRequestException(
        Consts.userNotExist,
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        id: fileItem.userId,
      },
    });
    let x = process.cwd();

    const { createReadStream, filename } = await fileItem.file;
    const folderPath = join(process.cwd(), `uploads/${user.userName}/avatar`);
    if (!existsSync(folderPath)) {
      mkdirSync(folderPath, { recursive: true });
    }
    const filePath = join(folderPath, filename);
    if (fileItem.file) {
      user.avatarPath = filePath;
      new Promise((resolve, reject) =>
        createReadStream()
          .pipe(createWriteStream(filePath))
          .on('finish', () => resolve(`File saved to ${filePath}`))
          .on('error', reject),
      );
    } else {
      if (existsSync(filePath)) {
        unlink(filePath, (err) => {
          throw new GraphQlBadRequestException(
            err.message,
            HttpStatus.BAD_REQUEST,
          );
        });
      }
      user.avatarPath = null;
    }
    await this.prismaService.user.update({
      data: { avatarPath: user.avatarPath },
      where: { id: user.id },
    });
    return true;
  }
  //#endregion
}
