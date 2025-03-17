import { beforeEach, describe, it } from 'node:test';
import { Roles } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { UsersResolver } from './users.graphql.controller';

describe('UsersResolver', () => {
  let usersResolver: UsersResolver;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersResolver],
    }).compile();
    usersResolver = await moduleRef.get(UsersResolver);
  });
  describe('UpdateUserRoles', () => {
    it('should update roles for selected users', async () => {
      let count = 0;
      let result = usersResolver.UpdateUserRoles({
        ids: ['24759c8b-91f1-4aec-8f87-733d33bbe7dc'],
        Roles: [Roles.Inspector],
      });
      expect(result).toBeGreaterThan(0);
    });
  });
});
