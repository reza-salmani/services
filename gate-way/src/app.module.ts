import {Module} from '@nestjs/common';
import {KafkaModule} from './modules/kafka';
import {GraphqlModule} from './modules/graphql';
import {PrismaService} from "./services/prisma-client";
import {UsersResolver} from "./graph-controllers/users";
import {PrismaUsersService} from "./services/prisma.users";
import {PrismaClient} from "@prisma/client";

@Module({
  imports: [KafkaModule, GraphqlModule],
  controllers: [],
  providers: [PrismaClient, PrismaService,PrismaUsersService,UsersResolver],
})
export class AppModule {}
