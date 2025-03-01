import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
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

@Injectable()
export class PrismaUsersService {
  constructor(
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  //========================= GetAllUsersByQuery ============================
  async GetAllUsersByQuery(queries: PrismaQuery): Promise<User[]> {
    return this.prismaService.user.findMany(queries);
  }

  //========================= GetUserByQuery ================================
  async GetUserByQuery(query: PrismaSingleQuery): Promise<User> {
    return this.prismaService.user.findFirst(query);
  }

  //======================== CreateUser =====================================
  async CreateUser(user: CreateUserDto): Promise<User> {
    let existUser = await this.prismaService.user.findUnique({
      where: { userName: user.userName },
    });
    if (existUser) {
      new BadRequestException(Consts.Duplicated);
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
    } catch (error) {
      throw new BadRequestException(error, Consts.badRequestMessage);
    }
  }
}
