import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaHumanResourceService } from '@base/services/kafka.hr';

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
  providers: [KafkaHumanResourceService],
})
export class KafkaModule {}
