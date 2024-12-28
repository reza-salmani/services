import { Module } from '@nestjs/common';
import { KafkaModule } from './bases/modules/kafka';
import { PrismaClient } from '@prisma/client';
import { GraphqlModule } from './bases/modules/Graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './Utils/tasks';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { UserModule } from './users/users.module';
import { PrismaService } from './bases/services/prisma-client';

@Module({
  imports: [
    KafkaModule,
    GraphqlModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    UserModule,
  ],
  controllers: [],
  providers: [PrismaClient, PrismaService, TasksService],
})
export class AppModule {}
