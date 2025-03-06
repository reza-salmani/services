import { Injectable } from '@nestjs/common';
import { Tools } from './tools';
import { PrismaService } from '@src/bases/services/prisma-client';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailerService } from './mail-server';
import { Consts } from './consts';
import { Roles } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailerService,
  ) {
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
              roles: [
                Roles.Admin,
                Roles.Demo,
                Roles.Demo_Viewer,
                Roles.User_Global,
                Roles.User_Management,
                Roles.Accounting_Management_Junior,
                Roles.Accounting_Management_Mid,
                Roles.Accounting_Management_Sinior,
                Roles.Accounting_Management_Viewer,
                Roles.Accounting_User_Junior,
                Roles.Accounting_User_Mid,
                Roles.Accounting_User_Sinior,
                Roles.Accounting_User_Viewer,
                Roles.Hr_Management_Junior,
                Roles.Hr_Management_Mid,
                Roles.Hr_Management_Sinior,
                Roles.Hr_Management_Viewer,
                Roles.Hr_User_Junior,
                Roles.Hr_User_Mid,
                Roles.Hr_User_Sinior,
                Roles.Hr_User_Viewer,
                Roles.Inspector,
                Roles.Inspector_Viewer,
                Roles.Security,
                Roles.Security_Viewer,
                Roles.Logestic_Management_Junior,
                Roles.Logestic_Management_Mid,
                Roles.Logestic_Management_Sinior,
                Roles.Logestic_Management_Viewer,
                Roles.Logestic_User_Junior,
                Roles.Logestic_User_Mid,
                Roles.Logestic_User_Sinior,
                Roles.Logestic_User_Viewer,
                Roles.TimeAttandance_Management_Junior,
                Roles.TimeAttandance_Management_Mid,
                Roles.TimeAttandance_Management_Sinior,
                Roles.TimeAttandance_Management_Viewer,
                Roles.TimeAttandance_User_Junior,
                Roles.TimeAttandance_User_Mid,
                Roles.TimeAttandance_User_Sinior,
                Roles.TimeAttandance_User_Viewer,
                Roles.Wages_Management_Junior,
                Roles.Wages_Management_Mid,
                Roles.Wages_Management_Sinior,
                Roles.Wages_Management_Viewer,
                Roles.Wages_User_Junior,
                Roles.Wages_User_Mid,
                Roles.Wages_User_Sinior,
                Roles.Wages_User_Viewer,
              ],
            },
            {
              name: 'UsersManagement',
              persianName: 'مدیریت کاربران',
              selfId: 1,
              parentId: null,
              isReadOnly: false,
              link: '/Shell/UsersManagement',
              roles: [
                Roles.Admin,
                Roles.Demo,
                Roles.Demo_Viewer,
                Roles.Inspector,
                Roles.Inspector_Viewer,
                Roles.Security,
                Roles.Security_Viewer,
                Roles.User_Global,
                Roles.User_Management,
              ],
            },
            {
              name: 'UsersList',
              persianName: 'لیست کاربران',
              selfId: 2,
              parentId: 1,
              isReadOnly: false,
              description: 'لیست کاملی از کاربران را در اختیار شما میگذارد',
              link: '/Shell/UsersManagement/UsersList',
              roles: [
                Roles.Admin,
                Roles.Demo,
                Roles.Demo_Viewer,
                Roles.Inspector,
                Roles.Inspector_Viewer,
                Roles.Security,
                Roles.Security_Viewer,
                Roles.User_Global,
                Roles.User_Management,
              ],
            },
            {
              name: 'UserClassification',
              persianName: 'مجوز دسترسی کاربران',
              selfId: 3,
              parentId: 1,
              isReadOnly: false,
              description:
                'مجوز دسترسی هر فرد به صفحات موجود در نرم افزار را میتوانید در این قسمت مدیریت نمایید',
              link: '/Shell/UsersManagement/UserClassification',
              roles: [
                Roles.Admin,
                Roles.Demo,
                Roles.Demo_Viewer,
                Roles.User_Global,
                Roles.User_Management,
              ],
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
            nationalCode: process.env['ADMIN_NATIONALCODE'],
            email: process.env['ADMIN_EMAIL'],
            phone: process.env['ADMIN_PHONE'],
            password: await Tools.hash(process.env['ADMIN_PASSWORD_SYSTEM']),
            userName: process.env['ADMIN_USERNAME'],
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
