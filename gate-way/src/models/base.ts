import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Consts } from 'src/Utils/consts';

export enum EnumRoles {
  Guest = 'Guest',
  Base = 'Base',
  User = 'User',
  Viewer = 'Viewer',
  Admin = 'Admin',
  Accountant = 'Accountant',
  Manager = 'Manager',
  Security = 'Security',
  Inspector = 'Inspector',
}

/**
 * for using custom enum in graphql we should register it first
 */
registerEnumType(EnumRoles, { name: 'EnumRoles' });

@ObjectType()
export class Counter {
  @Field(() => Int, {
    nullable: true,
    name: 'count',
    description: Consts.Count,
  })
  count: number;
}
