import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaUsersService } from 'src/services/kafka.users';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'users_service',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'users',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'users_comsumer',
          },
        },
      },
    ]),
  ],
  providers: [KafkaUsersService],
})
export class KafkaModule {}
