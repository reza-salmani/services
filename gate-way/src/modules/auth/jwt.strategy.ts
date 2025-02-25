import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayLoad } from './auth.model';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { Tools } from 'src/Utils/tools';
import { JwtService } from '@nestjs/jwt';
import { Context } from 'vm';
import { EnumRoles } from '@src/bases/base';
import { PrismaService } from '@src/bases/services/prisma-client';
import { Consts } from '@src/Utils/consts';
import { UnauthorizedException } from '@src/bases/services/error-handler';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (context: Context) => {
          const { req } = context;
          let jwt = null;
          if (req && req.cookies) jwt = req.cookies['jwt'];
          return jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  async validate(payload: JwtPayLoad) {
    return { userId: payload.sub, username: payload.userName };
  }
}

@Injectable()
export class JWTRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (context: Context) => {
          const { req } = context;
          let jwt = null;
          if (req && req.cookies) jwt = req.cookies['jwt'];
          return jwt;
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESHTOKEN_SECRET'),
      passReqToCallback: true,
    });
  }
  validate(context: Context, payload: any) {
    const { req } = context;
    if (req && req.cookies['jwt']) {
      const refreshToken = req.cookies['jwt'].trim();
      return { ...payload, refreshToken };
    } else {
      return null;
    }
  }
}

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    let ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    if (req && !req.cookies['jwt']) {
      throw new UnauthorizedException(null, Consts.tokenExpired);
    }
    let verify = await this.jwtService.verifyAsync(req.cookies['jwt'], {
      secret: this.configService.get('JWT_SECRET'),
    });
    if (!verify) throw new UnauthorizedException(null, Consts.unAuthorized);
    return true;
  }
}
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const decoratorRoles = this.reflector.get(HasRoles, context.getHandler());
    const decoratorNotRoles = this.reflector.get(
      HasNotRoles,
      context.getHandler(),
    );
    if (!decoratorRoles && !decoratorNotRoles) {
      return true;
    }
    let ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    if (req && !req.cookies['jwt']) {
      throw new UnauthorizedException(null, Consts.tokenExpired);
    }
    const headerInfo = this.jwtService.decode(req.cookies['jwt'].trim());

    let userRoles = await this.prismaService.user.findFirst({
      where: { id: headerInfo.sub },
    });
    return decoratorNotRoles
      ? Tools.matchs(
          userRoles.roles,
          Object.values(EnumRoles).filter(
            (x) => !decoratorNotRoles.some((y) => y === x),
          ),
        )
      : Tools.matchs(userRoles.roles, decoratorRoles);
  }
}
export const HasRoles = Reflector.createDecorator<string[]>();
export const HasNotRoles = Reflector.createDecorator<string[]>();
