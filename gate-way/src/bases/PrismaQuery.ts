import { Field, InputType, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { GraphQLScalarType } from 'graphql';

@InputType()
export class PrismaQuery {
  @Field((type) => Int, { nullable: true })
  take: number;
  @Field((type) => Int, { nullable: true })
  skip: number;
  @Field((type) => PrismaUserWhereUniqueInput, { nullable: true })
  cursor: Prisma.UserWhereUniqueInput;
  @Field((type) => PrismaUserScalarFieldEnum, { nullable: true })
  distinct: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
  @Field((type) => PrismaUserOrderByWithRelationInput, { nullable: true })
  orderBy: Prisma.UserOrderByWithRelationInput;
  @Field((type) => PrismaUserSelect, { nullable: true })
  select: Prisma.UserSelect<DefaultArgs>;
  @Field((type) => PrismaUserWhereInput, { nullable: true })
  where: Prisma.UserWhereInput;
}

@InputType()
export class PrismaSingleQuery {
  @Field((type) => PrismaUserWhereInput, { nullable: true })
  where: Prisma.UserWhereInput;
}

export const PrismaUserWhereUniqueInput = new GraphQLScalarType<
  Prisma.UserWhereUniqueInput | Prisma.UserScalarFieldEnum[],
  Prisma.UserWhereUniqueInput | Prisma.UserScalarFieldEnum[]
>({
  name: 'cursor',
  serialize: (
    value: Prisma.UserWhereUniqueInput | Prisma.UserScalarFieldEnum[],
  ) => value,
  parseValue: (
    value: Prisma.UserWhereUniqueInput | Prisma.UserScalarFieldEnum[],
  ) => value,
});

export const PrismaUserScalarFieldEnum = new GraphQLScalarType<
  Prisma.UserScalarFieldEnum,
  Prisma.UserScalarFieldEnum
>({
  name: 'distinct',
  serialize: (value: Prisma.UserScalarFieldEnum) => value,
  parseValue: (value: Prisma.UserScalarFieldEnum) => value,
});

export const PrismaUserOrderByWithRelationInput = new GraphQLScalarType<
  Prisma.UserOrderByWithRelationInput,
  Prisma.UserOrderByWithRelationInput
>({
  name: 'orderBy',
  serialize: (value: Prisma.UserOrderByWithRelationInput) => value,
  parseValue: (value: Prisma.UserOrderByWithRelationInput) => value,
});

export const PrismaUserSelect = new GraphQLScalarType<
  Prisma.UserSelect<DefaultArgs>,
  Prisma.UserSelect<DefaultArgs>
>({
  name: 'select',
  serialize: (value: Prisma.UserSelect<DefaultArgs>) => value,
  parseValue: (value: Prisma.UserSelect<DefaultArgs>) => value,
});

export const PrismaUserWhereInput = new GraphQLScalarType<
  Prisma.UserWhereInput,
  Prisma.UserWhereInput
>({
  name: 'where',
  serialize: (value: Prisma.UserWhereInput) => value,
  parseValue: (value: Prisma.UserWhereInput) => value,
});
