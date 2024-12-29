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
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

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
  ],
})
export class AppModule {}
