import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseEntity } from './entities/house.entity.js';
import { HousesService } from './services/houses.service.js';
import { EntrancesModule } from '../entrances/entrances.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([HouseEntity]), EntrancesModule],
  providers: [HousesService],
  exports: [HousesService],
})
export class HousesModule {}
