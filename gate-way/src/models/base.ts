import { registerEnumType } from '@nestjs/graphql';

export enum EnumRules {
  Guest,
  Base,
  User,
  Viewer,
  Admin,
  Accountant,
  Manager,
  Security,
  Inspector,
}

/**
 * for using custom enum in graphql we should register it first
 */
registerEnumType(EnumRules, { name: 'EnumRules' });
