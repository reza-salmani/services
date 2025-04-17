import { PrismaAuthService } from './auth.prisma.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@base/services/prisma-client';
import { ConfigService } from '@nestjs/config';
import { Context } from 'vm';

describe('PrismaAuthService', () => {
  let prismaAuthService: PrismaAuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let configService: ConfigService;
  let context: Context;
  beforeEach(async () => {
    jwtService = new JwtService();
    configService = new ConfigService();
    prismaService = new PrismaService();
    prismaAuthService = new PrismaAuthService(
      prismaService,
      configService,
      jwtService,
    );
    context = {
      req: {
        cookies: {
          jwt: `${
            (
              await prismaAuthService.Login(
                { userName: 'admin', password: 'admin@r.R' },
                {
                  req: {},
                  res: {
                    cookie: jest.fn(),
                  },
                },
              )
            ).access_token
          }`,
        },
      },
    };
  });
  describe('GetRoles', () => {
    it('should get all roles', async () => {
      expect(await prismaAuthService.GetRoles()).toHaveReturned;
    });
  });
  describe('GetMenu', () => {
    it('should get all menu', async () => {
      expect(await prismaAuthService.GetPages(context)).toHaveReturned;
    });
  });
  describe('checkWritable', () => {
    it('should checkWritable page for current user', async () => {
      let result = await prismaAuthService.CheckWritable('UsersList', context);
      expect(result).toBeTruthy();
    });
  });
});
