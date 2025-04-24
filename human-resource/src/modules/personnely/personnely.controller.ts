import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreatePersonnelDto,
  TogglePersonnelDto,
  UpdatePersonnelDto,
} from './personnely.model.tdo';
import { PrismaService } from 'src/services/prisma.service';

@Controller()
export class PersonnelController {
  constructor(private prisma: PrismaService) {}

  //#region ------------- create_personnel ----------------
  @MessagePattern('create_personnel')
  async CreatePersonnel(@Payload() message: CreatePersonnelDto) {
    return await this.prisma.personnel.create({ data: message }).then();
  }
  //#endregion

  //#region ------------- create_personnel ----------------
  @MessagePattern('get_all_personnel')
  async GetAllPersonnel(payload: any) {
    return await this.prisma.personnel.findMany(payload);
  }
  //#endregion

  //#region ------------- create_personnel ----------------
  @MessagePattern('get_personnel_by')
  async GetPersonnelBy(payload: any) {
    return await this.prisma.personnel.findFirst(payload);
  }
  //#endregion

  //#region ------------- upload_personnel ----------------
  @MessagePattern('update_personnel')
  async UpdatePersonnel(payload: UpdatePersonnelDto) {
    let inputPayload = JSON.parse(JSON.stringify(payload));
    delete inputPayload.id;
    return await this.prisma.personnel.update({
      data: inputPayload,
      where: { id: payload.id },
    });
  }
  //#endregion

  //#region ------------- delete_personnel ----------------
  @MessagePattern('delete_personnel')
  async DeletePersonnel(payload: string[]) {
    return await this.prisma.personnel.deleteMany({
      where: { id: { in: payload } },
    });
  }
  //#endregion

  //#region ------------- toggle_activation_personnel ----------------
  @MessagePattern('toggle_activation_personnel')
  async TogglePersonnelActivation(payload: TogglePersonnelDto) {
    return await this.prisma.personnel.updateMany({
      data: { activation: payload.status },
      where: { id: { in: payload.ids } },
    });
  }
  //#endregion
}
