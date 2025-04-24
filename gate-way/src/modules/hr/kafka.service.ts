import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  CreatePersonnelModelDto,
  ToggleActivation,
  UpdatePersonnelDto,
} from './kafka.model.dto';

@Injectable()
export class KafkaHumanResourceService implements OnModuleInit {
  constructor(
    @Inject('hr_service')
    private readonly kafkaService: ClientKafka,
  ) {}
  async onModuleInit() {
    this.kafkaService.subscribeToResponseOf('get_all_personnel');
    this.kafkaService.subscribeToResponseOf('get_personnel_by');
    this.kafkaService.subscribeToResponseOf('create_personnel');
    this.kafkaService.subscribeToResponseOf('update_personnel');
    this.kafkaService.subscribeToResponseOf('delete_personnel');
    this.kafkaService.subscribeToResponseOf('toggle_activation_personnel');
    await this.kafkaService.connect();
  }

  //#region ------------- get_all_personnel ----------------
  async GetAllPersonnel(payload: any) {
    return this.kafkaService.send('get_all_personnel', JSON.stringify(payload));
  }
  //#endregion --------------------------------------------

  //#region ------------- get_by_personnel ----------------
  async GetPersonnelBy(payload: any) {
    return this.kafkaService.send('get_personnel_by', JSON.stringify(payload));
  }
  //#endregion --------------------------------------------

  //#region ------------- create_personnel ----------------
  async CreatePersonnel(payload: CreatePersonnelModelDto) {
    return this.kafkaService.send('create_personnel', JSON.stringify(payload));
  }
  //#endregion --------------------------------------------

  //#region ------------- update_personnel ----------------
  async UpdatePersonnel(payload: UpdatePersonnelDto) {
    return this.kafkaService.send('update_personnel', JSON.stringify(payload));
  }
  //#endregion --------------------------------------------

  //#region ------------- delete_personnel ----------------
  async DeletePersonnel(payload: string[]) {
    return this.kafkaService.send('delete_personnel', JSON.stringify(payload));
  }
  //#endregion --------------------------------------------

  //#region ------------- toggle_activation_personnel ----------------
  async ToggleActivationPersonnel(payload: ToggleActivation) {
    return this.kafkaService.send(
      'toggle_activation_personnel',
      JSON.stringify(payload),
    );
  }
  //#endregion --------------------------------------------
}
