import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseEntity } from './entities/house.entity.js';
import { WriteHousesService } from './services/write-houses.service.js';
import { EntrancesModule } from '../entrances/entrances.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([HouseEntity]), EntrancesModule],
  providers: [WriteHousesService],
  exports: [WriteHousesService],
})
export class HousesModule {}
