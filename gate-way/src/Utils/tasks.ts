import { Injectable } from '@nestjs/common';
import { Tools } from './tools';
import { PrismaService } from '@src/bases/services/prisma-client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EnumRoles } from '@src/bases/base';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {
    this.SetAdminForInitialDeployment();
    this.CreatePagesForInitialDeployment();
  }

  //======================= Normal Tasks ==========================
  //#region  Initial Deployment
  async CreatePagesForInitialDeployment() {
    let existpages = await this.prismaService.page.count();
    if (existpages === 0) {
      this.prismaService.page
        .createMany({
          data: [
            {
              name: 'Home',
              persianName: 'خانه',
              selfId: 0,
              parentId: null,
              isReadOnly: false,
              link: '/Shell',
              roles: [EnumRoles.Admin],
            },
            {
              name: 'UsersManagement',
              persianName: 'مدیریت کاربران',
              selfId: 1,
              parentId: null,
              isReadOnly: false,
              link: '/UsersManagement',
              roles: [EnumRoles.Admin],
            },
            {
              name: 'UsersList',
              persianName: 'لیست کاربران',
              selfId: 2,
              parentId: 1,
              isReadOnly: false,
              description: 'لیست کاملی از کاربران را در اختیار شما میگذارد',
              link: '/UsersList',
              roles: [EnumRoles.Admin],
            },
            {
              name: 'UserClassification',
              persianName: 'مجوز دسترسی کاربران',
              selfId: 3,
              parentId: 1,
              isReadOnly: false,
              description:
                'مجوز دسترسی هر فرد به صفحات موجود در نرم افزار را میتوانید در این قسمت مدیریت نمایید',
              link: '/UserClassification',
              roles: [EnumRoles.Admin],
            },
          ],
        })
        .then();
    }
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
