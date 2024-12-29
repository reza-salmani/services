import { Module } from '@nestjs/common';
import { PrismaAuthService } from './auth.prisma.service';
import { AuthResolver } from './auth.controller';
import { PrismaService } from 'src/bases/services/prisma-client';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTRefreshTokenStrategy, JWTStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('EXPIRE_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [AuthResolver],
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
