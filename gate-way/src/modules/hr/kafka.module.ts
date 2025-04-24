import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaHumanResourceService } from 'src/modules/hr/kafka.service';
import { KafKaHumanResourceResolver } from './kafka.controller';
import { PrismaService } from '@base/services/prisma-client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaUsersService } from '@users/users.prisma.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'hr_service',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'hr',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'hr_consumer',
          },
        },
      },
    ]),
  ],
  providers: [
    JwtService,
    PrismaService,
    ConfigService,
    PrismaUsersService,
    KafkaHumanResourceService,
    KafKaHumanResourceResolver,
  ],
  exports: [KafkaHumanResourceService, KafKaHumanResourceResolver],
})
export class HumanResourceKafkaModule {}
