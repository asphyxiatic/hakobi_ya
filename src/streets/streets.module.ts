import { Module } from '@nestjs/common';
import { StreetsService } from './services/streets.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreetEntity } from './entities/street.entity.js';
import { HousesModule } from '../houses/houses.module.js';
import { StreetsController } from './controllers/streets.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([StreetEntity]), HousesModule],
  controllers: [StreetsController],
  providers: [StreetsService],
  exports: [StreetsService],
})
export class StreetsModule {}
