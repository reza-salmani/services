import { describe, it } from 'node:test';
import { PrismaAuthService } from './auth.prisma.service';
import { Test } from '@nestjs/testing';
import { AuthResolver } from './auth.controller';

describe('AuthResolver', () => {
  let prismaAuthService: PrismaAuthService;
  let authResolver: AuthResolver;
  beforeAll(async () => {
    let module = Test.createTestingModule({
      providers: [PrismaAuthService, AuthResolver],
    }).compile();
    prismaAuthService = (await module).get(PrismaAuthService);
    authResolver = (await module).get(AuthResolver);
  });
  describe('GetRoles', () => {
    it('should get all roles', async () => {
      let roles = ['admin'];
      jest.spyOn(authResolver, 'GetRoles').getMockImplementation();
      expect(await authResolver.GetRoles()).toBe(roles);
    });
  });
});
