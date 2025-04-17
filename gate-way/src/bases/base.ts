import {
  Field,
  Int,
  ObjectType,
  registerEnumType,
  Scalar,
} from '@nestjs/graphql';
import { Roles } from '@prisma/client';
import { Users } from '@users/users.model';
import { Consts } from '@utils/consts';
import { GraphQLUpload } from 'graphql-upload-ts';

/**
 * for using custom enum in graphql we should register it first
 * @param enum
 */
registerEnumType(Roles, { name: 'EnumRoles' });

/**
 * output model for some graphql controler
 * @param number
 */
@ObjectType()
export class Counter {
  @Field(() => Int, {
    nullable: true,
    name: 'count',
    description: Consts.Count,
  })
  count: number;
}

/**
 * output model for pagination in queries
 * @param totalCount:number
 * @param pageSize:number
 * @param pageNumber:number
 */
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

/**
 * output model for some graphql controlers
 * @returns users[]
 */
@ObjectType()
export class UserOutput extends BaseQuery {
  @Field(() => [Users], {
    name: 'items',
    nullable: true,
  })
  items: Users[];
}

/**
 *
 */
@Scalar('Upload', () => GraphQLUpload)
export class UploadScalar {}
