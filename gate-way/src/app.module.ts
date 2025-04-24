import { Module } from '@nestjs/common';
import { HumanResourceKafkaModule } from './modules/hr/kafka.module';
import { PrismaClient } from '@prisma/client';
import { GraphqlModule } from './bases/modules/Graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './utils/tasks';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { UserModule } from './modules/users/users.module';
import { PrismaService } from './bases/services/prisma-client';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { CustomLogger } from './utils/logger';
import { MailerService } from './utils/mail-server';

@Module({
  imports: [
    HumanResourceKafkaModule,
    GraphqlModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    PrismaClient,
    PrismaService,
    TasksService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    CustomLogger,
    MailerService,
  ],
})
export class AppModule {}
