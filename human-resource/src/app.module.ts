import { Module } from '@nestjs/common';
import { PersonnelController } from './modules/personnely/personnely.controller';
import { ClientKafka } from '@nestjs/microservices';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [],
  controllers: [PersonnelController],
  providers: [ClientKafka, PrismaService],
})
export class AppModule {}
