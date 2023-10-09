import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { EntranceEntity } from '../entities/entrance.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingСompletionEntranceResponse } from '../interfaces/setting-completion-entrance-response.interface.js';
import { HouseEntity } from '../../houses/entities/house.entity.js';
import { ENTRANCE_NOT_FOUND } from '../../common/errors/errors.constants.js';

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

  // ----------------------------------------------------------------------
  public async save(
    saveOptions: Partial<EntranceEntity>,
  ): Promise<EntranceEntity> {
    const savedEntrance = await this.entrancesRepository.save(saveOptions);

    return this.findOne({ id: savedEntrance.id });
  }

  // ---------------------------------------------------------------
  public async createEntrancesForHouse(
    houseId: string,
    quantity: number,
  ): Promise<EntranceEntity[]> {
    const entrances: EntranceEntity[] = [];

    for (let numberEntrance = 1; numberEntrance <= quantity; numberEntrance++) {
      entrances.push(
        await this.save({
          houseId: houseId,
          numberEntrance: numberEntrance,
        }),
      );
    }

    return entrances;
  }

  // ---------------------------------------------------------------
  public async updateEntrancesForHouse(
    houseId: string,
    updatedQuantity: number,
  ): Promise<EntranceEntity[]> {
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
      for (
        let numberEntrance = countEntrancesForHouse + 1;
        numberEntrance <= updatedQuantity;
        numberEntrance++
      ) {
        await this.save({
          houseId: houseId,
          numberEntrance: numberEntrance,
        });
      }
    }

    const entrances = await this.entrancesRepository.find({
      where: { houseId: houseId },
    });

    return entrances;
  }

  // ---------------------------------------------------------------
  public async settingСompletionEntrance(
    houseId: string,
    numberEntrance: number,
    complete: boolean,
  ): Promise<SettingСompletionEntranceResponse> {
    const entrance = await this.findOne({
      houseId: houseId,
      numberEntrance: numberEntrance,
    });

    if (!entrance) throw new NotFoundException(ENTRANCE_NOT_FOUND);

    const updatedСonditionEntrance = await this.save({
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
