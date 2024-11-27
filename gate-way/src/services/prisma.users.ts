import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma-client';

@Injectable()
export class PrismaUsersService {
  constructor(private prismaService: PrismaService) {}
}
