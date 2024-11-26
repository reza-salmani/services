import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaUsersService } from './services/kafka.users';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private kafkaUserService: KafkaUsersService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  CreateUser(@Body() payload: any) {
    return this.kafkaUserService.CreateUser(payload);
  }
}
//https://github.com/tkssharma/nestjs-kafka-monorepo/blob/develop/apps/api-gateway/src/app.controller.ts
//https://github.com/israelio/nestjs-kafka-example/blob/master/src/app.controller.ts
//https://blog.logrocket.com/microservices-nestjs-kafka-typescript/
