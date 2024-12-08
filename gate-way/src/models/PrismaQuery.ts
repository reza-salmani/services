import {Prisma} from "@prisma/client";

export class PrismaQuery {
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
    cursor?: Prisma.UserWhereUniqueInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    select?: Prisma.UserSelect;
    skip?: Number;
    take?: Number;
    where?: Prisma.UserWhereInput;
}
