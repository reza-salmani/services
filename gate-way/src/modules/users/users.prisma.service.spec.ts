import { Roles } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { PrismaAuthService } from '@auth/auth.prisma.service';
import { PrismaService } from '@base/services/prisma-client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Context } from 'vm';
import { PrismaUsersService } from './users.prisma.service';

describe('UsersResolver', () => {
  let prismaUserService: PrismaUsersService;
  let prismaAuthService: PrismaAuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let configService: ConfigService;
  let context: Context;
  beforeEach(async () => {
    const moduleRef = Test.createTestingModule({
      providers: [
        JwtService,
        ConfigService,
        PrismaService,
        PrismaUsersService,
        PrismaAuthService,
      ],
    }).compile();
    jwtService = (await moduleRef).get(JwtService);
    prismaService = (await moduleRef).get(PrismaService);
    configService = (await moduleRef).get(ConfigService);
    prismaAuthService = (await moduleRef).get(PrismaAuthService);
    prismaUserService = (await moduleRef).get(PrismaUsersService);
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
  describe('UpdateUserRoles', () => {
    it('should update roles for selected users', async () => {
      let count = 0;
      let result = await prismaUserService.UpdateUserRoles({
        ids: ['24759c8b-91f1-4aec-8f87-733d33bbe7dc'],
        Roles: [Roles.Admin],
      });
      expect(result.count).toBeGreaterThan(0);
    });
  });
});
