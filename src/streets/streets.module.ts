import { Module } from '@nestjs/common';
import { StreetsService } from './services/streets.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreetEntity } from './entities/street.entity.js';
import { HousesModule } from '../houses/houses.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([StreetEntity]), HousesModule],
  providers: [StreetsService],
})
export class StreetsModule {}