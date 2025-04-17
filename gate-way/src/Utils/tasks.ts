import { PrismaService } from '@base/services/prisma-client';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Consts } from './consts';
import { MailerService } from './mail-server';
import { Tools } from './tools';
import { Page } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailerService,
  ) {
    this.CreatePagesForInitialDeployment();
  }

  //======================= Normal Tasks ==========================
  //#region  Initial Deployment
  async CreatePagesForInitialDeployment() {
    let existpages = await this.prismaService.page.count();
    if (existpages === 0) {
      this.prismaService.page
        .create({
          data: {
            isReadOnly: false,
            name: 'menu',
            persianName: 'منو',
            description: null,
            link: null,
            parentId: null,
            children: {
              create: [
                {
                  name: 'Home',
                  isReadOnly: false,
                  persianName: 'خانه',
                  description: null,
                  link: '/Shell',
                },
                {
                  name: 'UsersManagement',
                  persianName: 'مدیریت کاربران',
                  isReadOnly: false,
                  link: '/Shell/UsersManagement',
                  description: null,
                  children: {
                    create: [
                      {
                        name: 'UsersList',
                        persianName: 'لیست کاربران',
                        isReadOnly: false,
                        description:
                          'لیست کاملی از کاربران را در اختیار شما میگذارد',
                        link: '/Shell/UsersManagement/UsersList',
                      },
                    ],
                  },
                },
              ],
            },
          },
        })
        .then(() => {
          this.SetAdminForInitialDeployment();
        });
    }
  }
  async SetAdminForInitialDeployment() {
    let existData = await this.prismaService.user.count();
    if (existData === 0) {
      let AllPages = await this.prismaService.page.findMany({
        include: { children: false },
      });
      this.prismaService.user
        .create({
          data: {
            nationalCode: process.env['ADMIN_NATIONALCODE'],
            email: process.env['ADMIN_EMAIL'],
            phone: process.env['ADMIN_PHONE'],
            password: await Tools.hash(process.env['ADMIN_PASSWORD_SYSTEM']),
            userName: process.env['ADMIN_USERNAME'],
            createDate: new Date().toISOString(),
            roles: ['Admin'],
            isActive: true,
            isDeleted: false,
            permittedPage: AllPages.map((page: Page) => page.id),
          },
        })
        .then();
    }
  }
  //#endregion

  //========================= Scheduled Tasks ==================================
  //#region ------------- Set Auth ExtraInfo ToDefault Daily
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
  //#region ------------- send email from admin to managers and users for inform about free space
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async SendLimitationSpaceDiskFromAdminToManagersAndUsers() {
    let { total, free } = await Tools.getDriveSize();
    if (free < 5000) {
      let usersAndManagers = await this.prismaService.user.findMany({
        where: {
          roles: { hasSome: ['User_Management', 'User_Global'] },
        },
      });
      if (usersAndManagers.length)
        usersAndManagers.map(async (item) => {
          await this.mailService.sendMail(
            item.email,
            Consts.freeDiskSpace,
            Consts.limitationDiskSpaceWarning,
          );
        });
    }
  }
  //#endregion
}
