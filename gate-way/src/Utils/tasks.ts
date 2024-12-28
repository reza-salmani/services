import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/bases/services/prisma-client';
import { Tools } from './tools';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {
    this.SetAdminForInitialDeployment();
  }

  async SetAdminForInitialDeployment() {
    let existData = await this.prismaService.user.count();
    if (existData === 0) {
      this.prismaService.user
        .create({
          data: {
            firstName: 'admin',
            lastName: 'admin',
            email: 'r.salmani.programming@gmail.com',
            phone: '09356436243',
            password: await Tools.hash('admin@r.R'),
            userName: 'admin',
            createDate: new Date().toISOString(),
            roles: ['Admin'],
            isActive: true,
            isDeleted: false,
          },
        })
        .then();
    }
  }
}
