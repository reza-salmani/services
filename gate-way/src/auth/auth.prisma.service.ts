import { Injectable } from '@nestjs/common';
import { PrismaService } from '../bases/services/prisma-client';
import { JwtPayLoad, LoginModel } from 'src/auth/auth.model';
import { Tools } from 'src/Utils/tools';
import { Consts } from 'src/Utils/consts';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './auth.model.dto';

@Injectable()
export class PrismaAuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

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
      roles: existUser.roles,
    };
    let access_token = await this.jwtService.signAsync(payLoad);
    let refresh_token = await this.jwtService.signAsync(payLoad, {
      expiresIn: this.configService.get('EXPIRE_TIME_REFRESH_TOKEN'),
    });
    let userAuthInfo = await this.prismaService.auth.findFirst({
      where: { userId: existUser.id },
    });
    if (!userAuthInfo) {
      await this.prismaService.auth.create({
        data: {
          userId: existUser.id,
          token: access_token,
          dailyloginCounter: 1,
          loginTime: new Date().toISOString(),
          isLogin: true,
          refreshToken: refresh_token,
        },
      });
    } else {
      await this.prismaService.auth.update({
        data: {
          userId: existUser.id,
          token: access_token,
          dailyloginCounter: userAuthInfo.dailyloginCounter + 1,
          loginTime: new Date().toISOString(),
          isLogin: true,
          refreshToken: refresh_token,
        },
        where: { id: userAuthInfo.id },
      });
    }
    return {
      access_token: access_token,
      refresh_token: refresh_token,
    };
  }

  //#endregion

  //#region refresh token
  async RefreshToken(ctx: Record<string, any>) {
    let userId = this.jwtService.decode(
      ctx.req.headers['authorization'].replace('Bearer', '').trim(),
    ).sub;
    let existItem = await this.prismaService.auth.findFirst({
      where: { userId: userId },
    });
    let existUser = await this.prismaService.user.findFirst({
      where: { id: userId },
    });
    if (existItem && existItem.refreshToken && existItem.isLogin) {
      let access_token = await this.jwtService.signAsync({
        userName: existUser.userName,
        sub: userId,
        roles: existUser.roles,
      });
      let refresh_token = await this.jwtService.signAsync(
        { userName: existUser.userName, sub: userId, roles: existUser.roles },
        {
          expiresIn: this.configService.get('EXPIRE_TIME_REFRESH_TOKEN'),
        },
      );
      await this.prismaService.auth.update({
        data: {
          token: access_token,
          dailyloginCounter: existItem.dailyloginCounter + 1,
          loginTime: new Date().toISOString(),
          refreshToken: refresh_token,
        },
        where: { id: existItem.id },
      });
      return { access_token: access_token, refresh_token: refresh_token };
    } else {
      return { access_token: '', refresh_token: '' };
    }
  }

  //#endregion

  //#region server side logout
  async serverSideLogout(ctx: Record<string, any>) {
    if (ctx.req.headers['authorization']) {
      let userId = this.jwtService.decode(
        ctx.req.headers['authorization'].replace('Bearer', '').trim(),
      ).sub;
      let existUserAuth = await this.prismaService.auth.findFirst({
        where: { userId: userId },
      });
      await this.prismaService.auth.update({
        data: {
          isLogin: false,
          refreshToken: '',
          token: '',
          logoutTime: new Date().toISOString(),
        },
        where: {
          id: existUserAuth.id,
        },
      });
    }
  }
  //#endregion

  //#region forgot password
  async ForgotPassword(forgotPasswordModel: ForgotPasswordDto) {}
  //#endregion
}
