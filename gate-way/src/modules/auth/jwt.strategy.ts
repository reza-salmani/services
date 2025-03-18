import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayLoad } from './auth.model';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Context } from 'vm';
import { Roles } from '@prisma/client';
import { PrismaAuthService } from './auth.prisma.service';
import {
  GraphQlForbiddenException,
  GraphQlUnauthorizedException,
} from '@base/services/error-handler';
import { PrismaService } from '@base/services/prisma-client';
import { Consts } from '@utils/consts';
import { Tools } from '@utils/tools';

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
    private prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext) {
    let ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    if (req && !req.cookies['jwt']) {
      throw new GraphQlUnauthorizedException(
        Consts.unAuthorized,
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      let isAuth = await this.jwtService.verifyAsync(req.cookies['jwt'], {
        secret: this.configService.get('JWT_SECRET'),
      });
      if (isAuth) return true;
    } catch (error) {
      return new PrismaAuthService(
        this.prismaService,
        this.configService,
        this.jwtService,
      ).IsAuthenticated(ctx.getContext());
    }
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
    const headerInfo = this.jwtService.decode(req.cookies['jwt'].trim());
    let userRoles = await this.prismaService.user.findFirst({
      where: { id: headerInfo.sub },
    });
    if (
      decoratorNotRoles
        ? !Tools.matchs(
            userRoles.roles,
            Object.values(Roles).filter(
              (x) => !decoratorNotRoles.some((y) => y === x),
            ),
          )
        : !Tools.matchs(userRoles.roles, decoratorRoles)
    ) {
      throw new GraphQlForbiddenException(
        Consts.ForbiddenMessage,
        HttpStatus.FORBIDDEN,
      );
    }
    return decoratorNotRoles
      ? Tools.matchs(
          userRoles.roles,
          Object.values(Roles).filter(
            (x) => !decoratorNotRoles.some((y) => y === x),
          ),
        )
      : Tools.matchs(userRoles.roles, decoratorRoles);
  }
}
export const HasRoles = Reflector.createDecorator<string[]>();
export const HasNotRoles = Reflector.createDecorator<string[]>();
