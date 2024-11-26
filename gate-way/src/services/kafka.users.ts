import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaUsersService {
  constructor(
    @Inject('users_service') private readonly kafKaUsersService: ClientKafka,
  ) {}
  CreateUser(payload: any) {
    this.kafKaUsersService.emit(
      'create_user',
      JSON.stringify({ name: 'reza', id: 0, family: 'salmani' }),
    );
  }
}
//https://github.com/tkssharma/nestjs-kafka-monorepo/blob/develop/apps/api-gateway/src/app.controller.ts
//https://github.com/israelio/nestjs-kafka-example/blob/master/src/app.controller.ts
//https://blog.logrocket.com/microservices-nestjs-kafka-typescript/
