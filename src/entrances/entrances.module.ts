import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntranceEntity } from './entities/entrance.entity.js';
import { EntrancesService } from './services/entrances.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([EntranceEntity])],
  providers: [EntrancesService],
  exports: [EntrancesService],
})
export class EntrancesModule {}
