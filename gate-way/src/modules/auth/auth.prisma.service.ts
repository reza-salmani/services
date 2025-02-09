import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './auth.model.dto';
import { PrismaService } from '@src/bases/services/prisma-client';
import { Consts } from '@src/Utils/consts';
import { Tools } from '@src/Utils/tools';
import { LoginModel, JwtPayLoad } from './auth.model';

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
    let access_token = await this.jwtService.signAsync(payLoad, {
      expiresIn: this.configService.get('EXPIRE_TIME'),
      issuer: this.configService.get('ISSUER'),
      secret: this.configService.get('JWT_SECRET'),
      algorithm: 'HS256',
    });
    let refresh_token = await this.jwtService.signAsync(payLoad, {
      expiresIn: this.configService.get('EXPIRE_TIME_REFRESH_TOKEN'),
      issuer: this.configService.get('ISSUER'),
      secret: this.configService.get('JWT_REFRESHTOKEN_SECRET'),
      algorithm: 'HS256',
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
          totalLoginCounter: userAuthInfo.totalLoginCounter + BigInt(1),
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
          totalLoginCounter: userAuthInfo.totalLoginCounter + BigInt(1),
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
    let userId = this.jwtService.decode(ctx.res.cookies('jwt').trim()).sub;
    let existItem = await this.prismaService.auth.findFirst({
      where: { userId: userId },
    });
    let existUser = await this.prismaService.user.findFirst({
      where: { id: userId },
    });
    if (existItem && existItem.refreshToken && existItem.isLogin) {
      let verify = this.jwtService.verifyAsync(existItem.refreshToken);
      if (verify) {
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
        const { res } = ctx;
        res.cookie('jwt', access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set to true in production
          sameSite: 'strict', // Adjust as per your requirements
          maxAge: 8 * 60 * 60 * 1000, // 1 hour
        });
        return { access_token: access_token, refresh_token: refresh_token };
      } else {
        return { access_token: '', refresh_token: '' };
      }
    } else {
      return { access_token: '', refresh_token: '' };
    }
  }

  //#endregion

  //#region server side logout
  async serverSideLogout(ctx: Record<string, any>) {
    if (ctx.res && ctx.res.cookies) {
      let userId = this.jwtService.decode(ctx.res.cookies('jwt').trim()).sub;
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
      ctx.res.clearCookie('jwt');
    }
  }
  //#endregion

  //#region forgot password
  async ForgotPassword(forgotPasswordModel: ForgotPasswordDto) {}
  //#endregion
}
