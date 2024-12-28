import { Module } from '@nestjs/common';
import { PrismaUsersService } from './users.prisma.service';
import { UsersResolver } from './users.graphql.controller';
import { PrismaService } from 'src/bases/services/prisma-client';

@Module({
  imports: [],
  exports: [UsersResolver],
  providers: [PrismaService, PrismaUsersService, UsersResolver],
})
export class UserModule {}
