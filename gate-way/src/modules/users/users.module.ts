import { Module } from '@nestjs/common';
import { PrismaUsersService } from './users.prisma.service';
import { UsersResolver } from './users.graphql.controller';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@src/bases/services/prisma-client';

@Module({
  imports: [],
  exports: [UsersResolver],
  providers: [
    JwtService,
    PrismaService,
    ConfigService,
    PrismaService,
    PrismaUsersService,
    UsersResolver,
  ],
})
export class UserModule {}
