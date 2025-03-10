import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordDto } from './auth.model.dto';
import { PrismaService } from '@src/bases/services/prisma-client';
import { Consts } from '@src/Utils/consts';
import { Tools } from '@src/Utils/tools';
import { LoginModel, JwtPayLoad, ForgotPasswordModel } from './auth.model';
import { Context } from 'vm';
import { DateTime } from '@src/Utils/date-time';
import {
  GraphQlBadRequestException,
  GraphQlNotFoundException,
  GraphQlUnauthorizedException,
} from '@src/bases/services/error-handler';
import { Roles } from '@prisma/client';

@Injectable()
export class PrismaAuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  //#region ------------- Sign In -------------------------
  async Login(loginModel: LoginModel, ctx: Record<string, any>) {
    let existUser = await this.prismaService.user.findUnique({
      where: { userName: loginModel.userName },
    });
    if (!existUser) {
      throw new GraphQlNotFoundException(
        Consts.userNotExist,
        HttpStatus.NOT_FOUND,
      );
    }
    if (existUser.wrongPasswordCounter >= 3) {
      if (DateTime.getDiffTime(new Date(), existUser.lockDownDate) > 3) {
        let copyOfUser = { ...existUser };
        delete copyOfUser.id;
        await this.prismaService.user.update({
          data: {
            ...copyOfUser,
            wrongPasswordCounter: 0,
            lockDownDate: null,
          },
          where: { id: existUser.id },
        });
      } else {
        throw new GraphQlBadRequestException(
          Consts.LockDownUser,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
    if (!(await Tools.compareHash(loginModel.password, existUser.password))) {
      let copyOfUser = { ...existUser };
      delete copyOfUser.id;
      await this.prismaService.user.update({
        data: {
          ...copyOfUser,
          wrongPasswordCounter: existUser.wrongPasswordCounter + 1,
        },
        where: { id: existUser.id },
      });
      if (existUser.wrongPasswordCounter === 2) {
        await this.prismaService.user.update({
          data: {
            ...copyOfUser,
            lockDownDate: new Date().toISOString(),
            wrongPasswordCounter: existUser.wrongPasswordCounter + 1,
          },
          where: { id: existUser.id },
        });
        throw new GraphQlBadRequestException(
          Consts.LockDownUser,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new GraphQlBadRequestException(
        Consts.loginParamsIsNotValid,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.ManageJWTToken(existUser, ctx);
  }
  //#endregion

  //#region ------------- Manage Jwt Token ----------------
  async ManageJWTToken(existUser: any, ctx: any, refreshToken: boolean = true) {
    let payLoad: JwtPayLoad = {
      userName: existUser.userName,
      sub: existUser.id,
      roles: existUser.roles,
    };
    let access_token = await this.jwtService.signAsync(payLoad, {
      expiresIn: this.configService.get('EXPIRE_TIME'),
      issuer: this.configService.get('ISSUER'),
      secret: this.configService.get('JWT_SECRET'),
      algorithm: 'HS512',
    });
    let refresh_token = '';
    if (refreshToken) {
      refresh_token = await this.jwtService.signAsync(payLoad, {
        expiresIn: this.configService.get('EXPIRE_TIME_REFRESH_TOKEN'),
        issuer: this.configService.get('ISSUER'),
        secret: this.configService.get('JWT_REFRESHTOKEN_SECRET'),
        algorithm: 'HS512',
      });
    }
    const { res } = ctx;
    res.cookie('jwt', access_token, {
      httpOnly: process.env['HTTP_ONLY'],
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env['SAME_SITE'],
      maxAge: process.env['MAX_AGE'],
    });
    let userAuthInfo = await this.prismaService.auth.findFirst({
      where: { userId: { equals: existUser.id } },
    });
    if (!userAuthInfo) {
      await this.prismaService.auth.create({
        data: {
          userId: existUser.id,
          token: access_token,
          dailyloginCounter: 1,
          totalLoginCounter: 1,
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
          refreshToken: refreshToken
            ? refresh_token
            : userAuthInfo.refreshToken,
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

  //#region ------------- Logout --------------------------
  async Logout(ctx: any) {
    try {
      if (
        ctx.req &&
        ctx.req.cookies &&
        ctx.req.cookies['jwt'] &&
        ctx.req.cookies['jwt'].length
      ) {
        let userId = this.jwtService.decode(ctx.req.cookies['jwt']).sub;
        let existUserAuth = await this.prismaService.auth.findFirst({
          where: { userId: { equals: userId } },
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
    } catch (error) {}
  }
  //#endregion

  //#region ------------- IsAuthenticated ------------------
  async IsAuthenticated(ctx: Context) {
    let existUserAuth = await Tools.GetUserInfoFromContext(
      ctx,
      this.jwtService,
      this.prismaService,
    );
    try {
      if (existUserAuth) {
        let verify = await this.jwtService.verifyAsync(existUserAuth.token, {
          secret: this.configService.get('JWT_SECRET'),
        });
        if (!verify) return false;
      } else {
        return false;
      }
    } catch (error) {
      try {
        let verifyRefreshToken = await this.jwtService.verifyAsync(
          existUserAuth.refreshToken,
          {
            secret: this.configService.get('JWT_REFRESHTOKEN_SECRET'),
          },
        );
        if (verifyRefreshToken) {
          let existUser = await this.prismaService.user.findUnique({
            where: { id: existUserAuth.userId },
          });
          await this.ManageJWTToken(existUser, ctx, false);
        } else {
          return false;
        }
      } catch (error) {
        throw new GraphQlUnauthorizedException(
          Consts.unAuthorized,
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
    return true;
  }
  //#endregion

  //#region ------------- ForgotPassword ------------------
  async ForgotPassword(
    forgotPasswordModel: ForgotPasswordDto,
  ): Promise<ForgotPasswordModel> {
    try {
      let existUser = await this.prismaService.user.findFirst({
        where: {
          OR: [
            { userName: { equals: forgotPasswordModel.userName } },
            { email: { equals: forgotPasswordModel.userName } },
            { phone: { equals: forgotPasswordModel.userName } },
          ],
        },
      });
      if (!existUser) {
        throw new GraphQlBadRequestException(
          Consts.wrongIncomingParameters,
          HttpStatus.BAD_REQUEST,
        );
      }
      let pass = await Tools.hash(forgotPasswordModel.password);
      let copyOfuser = { ...existUser };
      delete copyOfuser.id;
      await this.prismaService.user.update({
        data: {
          ...copyOfuser,
          password: pass,
          passwordChangeLastDate: new Date().toISOString(),
        },
        where: { id: existUser.id },
      });
      return { userName: existUser.userName };
    } catch (error) {}
  }
  //#endregion

  //#region-------------- Get Menu ------------------------
  async GetPages(context: any) {
    let result = await this.prismaService.page.findMany();
    const { req } = context;
    if (req && !req.cookies['jwt']) {
      throw new UnauthorizedException(Consts.unAuthorized);
    }
    const headerInfo = this.jwtService.decode(req.cookies['jwt'].trim());

    let userRoles = await this.prismaService.user.findFirst({
      where: { id: headerInfo.sub },
    });
    result = result.filter((page) =>
      userRoles.roles.some((b) => page.roles.some((v) => v === b)),
    );
    return result;
  }
  //#endregion
  //#region ------------- Get Roles -----------------------
  async GetRoles() {
    return new Enumerator(Roles).item;
  }

  //#endregion
}
