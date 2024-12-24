import { Module } from '@nestjs/common';
import { KafkaModule } from './modules/kafka';
import { PrismaService } from './services/prisma-client';
import { UsersResolver } from './graph-controllers/users';
import { PrismaUsersService } from './services/prisma.users';
import { PrismaClient } from '@prisma/client';
import { GraphqlModule } from './modules/Graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './Utils/tasks';
import { ConfigModule } from '@nestjs/config';
import { AuthResolver } from './graph-controllers/auth';
import { PrismaAuthService } from './services/prisma.auth';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    KafkaModule,
    GraphqlModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
  ],
  controllers: [],
  providers: [
    PrismaClient,
    PrismaService,
    PrismaUsersService,
    PrismaAuthService,
    UsersResolver,
    AuthResolver,
    TasksService,
  ],
})
export class AppModule {}
