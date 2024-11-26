import { Body, Controller, Post } from '@nestjs/common';
import { KafkaUsersService } from 'src/services/kafka.users';

@Controller('users')
export class UsersController {
  constructor(private kafkaUserService: KafkaUsersService) {}
  @Post()
  CreateUser(@Body() payload: any) {
    return this.kafkaUserService.CreateUser(payload);
  }
}
