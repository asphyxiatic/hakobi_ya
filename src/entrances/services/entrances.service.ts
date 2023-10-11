import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { EntranceEntity } from '../entities/entrance.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTRANCE_NOT_FOUND } from '../../common/errors/errors.constants.js';
import { EntranceResponse } from '../interfaces/entrance-response.interface.js';
import { EntranceFindOneResponse } from '../interfaces/entrance-find-on-response.interace.js';

@Injectable()
export class EntrancesService {
  constructor(
    @InjectRepository(EntranceEntity)
    private readonly entrancesRepository: Repository<EntranceEntity>,
  ) {}

  // ---------------------------------------------------------------
  public async find(
    findOptions: FindOptionsWhere<EntranceEntity>,
  ): Promise<EntranceResponse[]> {
    return this.entrancesRepository.find({
      where: findOptions,
      select: ['numberEntrance', 'completed'],
    });
  }

  // ---------------------------------------------------------------
  public async findOne(
    findOptions: FindOptionsWhere<EntranceEntity>,
  ): Promise<EntranceFindOneResponse> {
    return this.entrancesRepository.findOne({
      where: findOptions,
      select: ['id', 'numberEntrance', 'completed'],
    });
  }

  // ----------------------------------------------------------------------
  public async saveAndSelect(
    saveOptions: Partial<EntranceEntity>,
  ): Promise<EntranceResponse> {
    const savedEntrance = await this.entrancesRepository.save(saveOptions);

    return {
      numberEntrance: savedEntrance.numberEntrance,
      completed: savedEntrance.completed,
    };
  }

  // ---------------------------------------------------------------
  public async createEntrancesForHouse(
    houseId: string,
    quantity: number,
  ): Promise<EntranceResponse[]> {
    const entrances: EntranceResponse[] = [];

    for (let numberEntrance = 1; numberEntrance <= quantity; numberEntrance++) {
      entrances.push(
        await this.saveAndSelect({
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
  ): Promise<EntranceResponse[]> {
    const countEntrancesForHouse = await this.entrancesRepository.count({
      where: { houseId: houseId },
    });

    if (countEntrancesForHouse > updatedQuantity) {
      await this.entrancesRepository
        .createQueryBuilder('entrance')
        .delete()
        .where('entrance.numberEntrance > :updatedQuantity', {
          updatedQuantity: updatedQuantity,
        })
        .execute();
    } else if (countEntrancesForHouse < updatedQuantity) {
      let numberEntrance = countEntrancesForHouse + 1;

      for (
        numberEntrance;
        numberEntrance <= updatedQuantity;
        numberEntrance++
      ) {
        await this.entrancesRepository.save({
          houseId: houseId,
          numberEntrance: numberEntrance,
        });
      }
    }

    const entrances = await this.find({ houseId: houseId });

    return entrances;
  }

  // ---------------------------------------------------------------
  public async settingСompletionEntrance(
    houseId: string,
    numberEntrance: number,
    complete: boolean,
  ): Promise<EntranceResponse> {
    const entrance = await this.findOne({
      houseId: houseId,
      numberEntrance: numberEntrance,
    });

    if (!entrance) throw new NotFoundException(ENTRANCE_NOT_FOUND);

    return this.saveAndSelect({ id: entrance.id, completed: complete });
  }
}
