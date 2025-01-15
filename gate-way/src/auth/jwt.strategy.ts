import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayLoad } from './auth.model';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { Tools } from 'src/Utils/tools';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/bases/services/prisma-client';
import { EnumRoles } from 'src/bases/base';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_REFRESHTOKEN_SECRET'),
      passReqToCallback: true,
    });
  }
  validate(req: Request, payload: any) {
    if (req.headers.get('authorization')) {
      const refreshToken = req.headers
        .get('authorization')
        .replace('Bearer', '')
        .trim();
      return { ...payload, refreshToken };
    } else {
      return null;
    }
  }
}

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    let ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
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
    if (!ctx.getContext().req.get('authorization')) {
      return false;
    }
    const headerInfo = this.jwtService.decode(
      ctx.getContext().req.get('authorization').replace('Bearer', '').trim(),
    );
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
