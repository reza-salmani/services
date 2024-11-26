import { Module } from '@nestjs/common';
import { KafkaModule } from './modules/kafka';
import { UsersController } from './controllers/users';

@Module({
  imports: [KafkaModule],
  controllers: [UsersController],
  providers: [],
})
export class AppModule {}
