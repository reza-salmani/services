import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { Consts } from '@utils/consts';

/**
 * for using custom enum in graphql we should register it first
 */
registerEnumType(Roles, { name: 'EnumRoles' });

@ObjectType()
export class Counter {
  @Field(() => Int, {
    nullable: true,
    name: 'count',
    description: Consts.Count,
  })
  count: number;
}
@ObjectType()
export class BaseQuery {
  @Field(() => Int, {
    nullable: false,
    name: 'totalCount',
    description: Consts.totalCount,
  })
  totalCount: number;

  @Field(() => Int, {
    nullable: false,
    name: 'pageSize',
    description: Consts.pageSize,
  })
  pageSize: number;

  @Field(() => Int, {
    nullable: false,
    name: 'pageNumber',
    description: Consts.pageNumber,
  })
  pageNumber: number;
}
