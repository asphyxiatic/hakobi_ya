import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntranceEntity } from './entities/entrance.entity.js';
import { WriteEntrancesService } from './services/write-entrances.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([EntranceEntity])],
  providers: [WriteEntrancesService],
  exports: [WriteEntrancesService],
})
export class EntrancesModule {}
