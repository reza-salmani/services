import { Module } from '@nestjs/common';
import { KafkaModule } from './modules/kafka';
import { PrismaService } from './services/prisma-client';
import { UsersResolver } from './graph-controllers/users';
import { PrismaUsersService } from './services/prisma.users';
import { PrismaClient } from '@prisma/client';
import { GraphqlModule } from './modules/Graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './Utils/tasks';

@Module({
  imports: [KafkaModule, GraphqlModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [
    PrismaClient,
    PrismaService,
    PrismaUsersService,
    UsersResolver,
    TasksService,
  ],
})
export class AppModule {}
