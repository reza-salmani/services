import { Module } from '@nestjs/common';
import { PrismaAuthService } from './auth.prisma.service';
import { AuthResolver } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTRefreshTokenStrategy, JWTStrategy } from './jwt.strategy';
import { PrismaService } from '@base/services/prisma-client';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('EXPIRE_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AuthResolver, JwtModule],
  providers: [
    PrismaService,
    ConfigService,
    PrismaAuthService,
    JWTStrategy,
    JWTRefreshTokenStrategy,
    AuthResolver,
  ],
})
export class AuthModule {}
