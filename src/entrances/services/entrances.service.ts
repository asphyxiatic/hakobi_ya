import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { EntranceEntity } from '../entities/entrance.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEntrance } from '../interfaces/create-entrance.interface.js';
import { UpdateEntrance } from '../interfaces/update-entrance.interface.js';
import { CompleteEntrance } from '../interfaces/complete-entrance.interface.js';

@Injectable()
export class EntrancesService {
  constructor(
    @InjectRepository(EntranceEntity)
    private readonly entrancesRepository: Repository<EntranceEntity>,
  ) {}

  // ---------------------------------------------------------------
  public async createEntrancesForHouse({
    houseId,
    quantity,
  }: CreateEntrance): Promise<EntranceEntity[]> {
    const entrances: EntranceEntity[] = [];

    for (let i = 1; i <= quantity; i++) {
      entrances.push(
        await this.entrancesRepository.save({
          houseId: houseId,
          numberEntrance: i,
        }),
      );
    }

    return entrances;
  }

  // ---------------------------------------------------------------
  public async updateEntrancesForHouse({
    houseId,
    quantity,
  }: UpdateEntrance): Promise<EntranceEntity[]> {
    const countEntrancesForHouse = await this.entrancesRepository.count({
      where: { houseId: houseId },
    });

    if (countEntrancesForHouse > quantity) {
      await this.entrancesRepository
        .createQueryBuilder('entrance')
        .delete()
        .where('entrance.number_entrance > :quantity', { quantity: quantity })
        .execute();
    } else if (countEntrancesForHouse < quantity) {
      for (let i = countEntrancesForHouse + 1; i <= quantity; i++) {
        await this.entrancesRepository.save({
          houseId: houseId,
          numberEntrance: i,
        });
      }
    }

    const entrances = await this.entrancesRepository.find({
      where: { houseId: houseId },
    });

    return entrances;
  }

  // ---------------------------------------------------------------
  public async settingСompletionEntrance({
    houseId,
    numberEntrance,
    complete,
  }: CompleteEntrance): Promise<EntranceEntity> {
    const entrance = await this.entrancesRepository.findOne({
      where: { houseId: houseId, numberEntrance: numberEntrance },
    });

    if (!entrance) {
      throw new NotFoundException('🚨 не найден подъезд!');
    }

    const updatedСonditionEntrance = await this.entrancesRepository.save({
      id: entrance.id,
      houseId: houseId,
      completed: complete,
    });

    return updatedСonditionEntrance;
  }
}
