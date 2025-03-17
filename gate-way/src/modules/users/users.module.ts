import { Module } from '@nestjs/common';
import { PrismaUsersService } from './users.prisma.service';
import { UsersResolver } from './users.graphql.controller';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@base/services/prisma-client';

@Module({
  imports: [],
  exports: [UsersResolver],
  providers: [
    JwtService,
    PrismaService,
    ConfigService,
    PrismaUsersService,
    UsersResolver,
  ],
})
export class UserModule {}
