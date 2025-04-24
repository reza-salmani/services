import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  CreatePersonnelModelDto,
  ToggleActivation,
  UpdatePersonnelDto,
} from './kafka.model.dto';
import { KafkaHumanResourceService } from './kafka.service';
import { GqlAuthGuard, HasNotRoles, HasRoles } from '@auth/jwt.strategy';
import { Roles } from '@prisma/client';
import { PersonnelListOutput } from './kafka.model';
import { PrismaQuery } from '@base/PrismaQuery';
import { UseGuards } from '@nestjs/common';
import { Counter } from '@base/base';

@UseGuards(GqlAuthGuard)
@Resolver()
export class KafKaHumanResourceResolver {
  constructor(private kafkaHumanResourceService: KafkaHumanResourceService) {}

  //#region ------------- get_all_personnel ----------------
  @HasNotRoles([
    Roles.Logestic_Management_Junior,
    Roles.Logestic_Management_Mid,
    Roles.Logestic_Management_Sinior,
    Roles.Logestic_Management_Viewer,
    Roles.Logestic_User_Junior,
    Roles.Logestic_User_Mid,
    Roles.Logestic_User_Sinior,
    Roles.Logestic_User_Viewer,
  ])
  @Query(() => [PersonnelListOutput], { name: 'getAllPersonnel' })
  async GetAllPersonnel(
    @Args({ name: 'getAllPersonnelModel', type: () => PrismaQuery })
    queriesModel: PrismaQuery,
  ) {
    return await this.kafkaHumanResourceService.GetAllPersonnel(queriesModel);
  }
  //#endregion

  //#region ------------- get_by_personnel ----------------
  @HasNotRoles([
    Roles.Logestic_Management_Junior,
    Roles.Logestic_Management_Mid,
    Roles.Logestic_Management_Sinior,
    Roles.Logestic_Management_Viewer,
    Roles.Logestic_User_Junior,
    Roles.Logestic_User_Mid,
    Roles.Logestic_User_Sinior,
    Roles.Logestic_User_Viewer,
  ])
  @Query(() => PersonnelListOutput, { name: 'getByPersonnel' })
  async GetByPersonnel(
    @Args({ name: 'getByPersonnelModel', type: () => PrismaQuery })
    queriesModel: PrismaQuery,
  ) {
    return await this.kafkaHumanResourceService.GetPersonnelBy(queriesModel);
  }
  //#endregion

  //#region ------------- create Personnel ----------------
  @HasRoles([
    Roles.Admin,
    Roles.Demo,
    Roles.Hr_Management_Junior,
    Roles.Hr_Management_Mid,
    Roles.Hr_Management_Sinior,
    Roles.Hr_User_Sinior,
    Roles.Hr_User_Mid,
  ])
  @Mutation(() => PersonnelListOutput, { name: 'createPersonnel' })
  async CreatePersonnel(
    @Args({ name: 'createPersonnelModel', type: () => CreatePersonnelModelDto })
    createModel: CreatePersonnelModelDto,
  ) {
    return await this.kafkaHumanResourceService.CreatePersonnel(createModel);
  }
  //#endregion

  //#region ------------- update Personnel ----------------
  @HasRoles([
    Roles.Admin,
    Roles.Demo,
    Roles.Hr_Management_Junior,
    Roles.Hr_Management_Mid,
    Roles.Hr_Management_Sinior,
    Roles.Hr_User_Sinior,
    Roles.Hr_User_Mid,
  ])
  @Mutation(() => PersonnelListOutput, { name: 'updatePersonnel' })
  async UpdatePersonnel(
    @Args({ name: 'updatePersonnelModel', type: () => UpdatePersonnelDto })
    updateModel: UpdatePersonnelDto,
  ) {
    return await this.kafkaHumanResourceService.UpdatePersonnel(updateModel);
  }
  //#endregion

  //#region ------------- delete Personnel ----------------
  @HasRoles([
    Roles.Admin,
    Roles.Demo,
    Roles.Hr_Management_Junior,
    Roles.Hr_Management_Mid,
    Roles.Hr_Management_Sinior,
    Roles.Hr_User_Sinior,
    Roles.Hr_User_Mid,
  ])
  @Mutation(() => Counter, { name: 'deletePersonnel' })
  async DeletePersonnel(
    @Args({ name: 'deletePersonnelModel', type: () => [String] })
    deleteModel: string[],
  ) {
    return await this.kafkaHumanResourceService.DeletePersonnel(deleteModel);
  }
  //#endregion

  //#region ------------- toggle activation Personnel ----------------
  @HasRoles([
    Roles.Admin,
    Roles.Demo,
    Roles.Hr_Management_Junior,
    Roles.Hr_Management_Mid,
    Roles.Hr_Management_Sinior,
    Roles.Hr_User_Sinior,
    Roles.Hr_User_Mid,
  ])
  @Mutation(() => Counter, { name: 'TogglePersonnelActivation' })
  async ToggleActivationPersonnel(
    @Args({ name: 'toggkePersonnelModel', type: () => ToggleActivation })
    toggleActivationModel: ToggleActivation,
  ) {
    return await this.kafkaHumanResourceService.ToggleActivationPersonnel(
      toggleActivationModel,
    );
  }
  //#endregion
}
