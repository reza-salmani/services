import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma-client';
import { JwtPayLoad, LoginModel } from 'src/models/auth/authModel';
import { Tools } from 'src/Utils/tools';
import { Consts } from 'src/Utils/consts';

@Injectable()
export class PrismaAuthService {
  constructor(private readonly prismaService: PrismaService) {}

  //#region sign in
  async Login(loginModel: LoginModel) {
    let existUser = await this.prismaService.user.findFirst({
      where: { userName: loginModel.userName },
    });
    if (!existUser) {
      throw new Error(Consts.loginParamsIsNotValid);
    }
    let pass = await Tools.hash(loginModel.password);
    if (!Tools.compareHash(pass, existUser.password)) {
      throw new Error(Consts.loginParamsIsNotValid);
    }
    let payLoad: JwtPayLoad = {
      userName: existUser.userName,
      sub: existUser.id,
    };
    return { access_token: '' };
  }
  //#endregion
}
