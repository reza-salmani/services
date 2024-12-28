import { Module } from '@nestjs/common';
import { PrismaAuthService } from './auth.prisma.service';
import { AuthResolver } from './auth.controller';
import { PrismaService } from 'src/bases/services/prisma-client';

@Module({
  imports: [],
  exports: [AuthResolver],
  providers: [PrismaService, PrismaAuthService, AuthResolver],
})
export class AuthModule {}
