import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
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
  );
}
bootstrap();
