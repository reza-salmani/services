import { Injectable } from '@nestjs/common';
import { Tools } from './tools';
import { PrismaService } from '@src/bases/services/prisma-client';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {
    this.SetAdminForInitialDeployment();
  }

  //======================= Normal Tasks ==========================
  //#region  Initial Deployment
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
  //#endregion

  //========================= Scheduled Tasks ==================================
  //#region Set Auth ExtraInfo ToDefault Daily
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async SetAsDefaultAuthTable() {
    this.prismaService.auth
      .updateMany({
        data: {
          dailyloginCounter: 0,
          isLogin: false,
          logoutTime: new Date().toISOString(),
          refreshToken: '',
          token: '',
        },
      })
      .then();
  }
  //#endregion
}
