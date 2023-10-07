import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { EntranceEntity } from '../entities/entrance.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEntranceOptions } from '../interfaces/create-entrance-options.interface.js';
import { UpdateEntranceOptions } from '../interfaces/update-entrance-options.interface.js';
import { CompleteEntranceOptions } from '../interfaces/complete-entrance-options.interface.js';
import { SettingСompletionEntranceResult } from '../interfaces/setting-completion-entrance-result.interface.js';

@Injectable()
export class EntrancesService {
  constructor(
    @InjectRepository(EntranceEntity)
    private readonly entrancesRepository: Repository<EntranceEntity>,
  ) {}

  // ---------------------------------------------------------------
  public async findOne(
    findOptions: FindOptionsWhere<EntranceEntity>,
  ): Promise<EntranceEntity> {
    return this.entrancesRepository.findOne({ where: findOptions });
  }

  // ---------------------------------------------------------------
  public async createEntrancesForHouse({
    houseId,
    quantity,
  }: CreateEntranceOptions): Promise<EntranceEntity[]> {
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
    updatedQuantity,
  }: UpdateEntranceOptions): Promise<EntranceEntity[]> {
    const countEntrancesForHouse = await this.entrancesRepository.count({
      where: { houseId: houseId },
    });

    if (countEntrancesForHouse > updatedQuantity) {
      await this.entrancesRepository
        .createQueryBuilder('entrance')
        .delete()
        .where('entrance.number_entrance > :quantity', {
          quantity: updatedQuantity,
        })
        .execute();
    } else if (countEntrancesForHouse < updatedQuantity) {
      for (let i = countEntrancesForHouse + 1; i <= updatedQuantity; i++) {
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
  }: CompleteEntranceOptions): Promise<SettingСompletionEntranceResult> {
    const entrance = await this.findOne({
      houseId: houseId,
      numberEntrance: numberEntrance,
    });

    if (!entrance) {
      throw new NotFoundException('🚨 не найден подъезд!');
    }

    const updatedСonditionEntrance = await this.entrancesRepository.save({
      id: entrance.id,
      houseId: houseId,
      completed: complete,
    });

    return {
      houseId: updatedСonditionEntrance.houseId,
      numberEntrance: updatedСonditionEntrance.numberEntrance,
      completed: updatedСonditionEntrance.completed,
    };
  }
}
