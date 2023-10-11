import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { HouseEntity } from '../entities/house.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { EntrancesService } from '../../entrances/services/entrances.service.js';
import {
  FAILED_REMOVE_HOUSES,
  HOUSE_NOT_FOUND,
} from '../../common/errors/errors.constants.js';
import { UpdateHouseOptions } from '../interfaces/update-house-options.interface.js';
import { HouseResponse } from '../interfaces/house-reaponse.interface.js';
import { HouseFindOneResponse } from '../interfaces/house-find-one-response.interface.js';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(HouseEntity)
    private readonly housesRepository: Repository<HouseEntity>,
    private readonly entrancesService: EntrancesService,
  ) {}

  //-------------------------------------------------------------
  public async findOneWithRelations(
    findOptions: FindOptionsWhere<HouseEntity>,
  ): Promise<HouseResponse | undefined> {
    return this.housesRepository
      .createQueryBuilder('house')
      .leftJoinAndSelect('house.entrances', 'entrances')
      .select(['house.id', 'houses.houseName'])
      .addSelect(['entrances.numberEntrance', 'entrances.completed'])
      .where(findOptions)
      .getOne();
  }

  //-------------------------------------------------------------
  public async findOne(
    findOptions: FindOptionsWhere<HouseEntity>,
  ): Promise<HouseFindOneResponse | undefined> {
    return this.housesRepository.findOne({
      where: findOptions,
      select: ['id', 'houseName'],
    });
  }

  //-------------------------------------------------------------
  public async saveAndSelect(
    saveOptions: Partial<HouseEntity>,
  ): Promise<HouseResponse> {
    const savedHouse = await this.housesRepository.save(saveOptions);

    return this.findOneWithRelations({ id: savedHouse.id });
  }

  //--------------------------------------------------------------------------
  public async create(
    streetId: string,
    houseName: string,
    quantityEntrances: number,
  ): Promise<HouseResponse> {
    const createdHouse = await this.housesRepository.save({
      streetId: streetId,
      houseName: houseName,
    });

    const entrances = await this.entrancesService.createEntrancesForHouse(
      createdHouse.id,
      quantityEntrances,
    );

    return {
      id: createdHouse.id,
      houseName: createdHouse.houseName,
      entrances: entrances,
    };
  }

  //--------------------------------------------------------------------------
  public async update({
    houseId,
    houseName,
    quantityEntrances,
  }: UpdateHouseOptions): Promise<HouseResponse> {
    const house = await this.findOneWithRelations({ id: houseId });

    if (!house) throw new NotFoundException(HOUSE_NOT_FOUND);

    const updateHouse = houseName
      ? await this.saveAndSelect({ id: houseId, houseName })
      : house;

    const updateEntrances = quantityEntrances
      ? await this.entrancesService.updateEntrancesForHouse(
        houseId,
        quantityEntrances,
      )
      : house.entrances;

    return {
      id: updateHouse.id,
      houseName: updateHouse.houseName,
      entrances: updateEntrances,
    };
  }

  //--------------------------------------------------------------------------
  public async delete(houseIds: string[]): Promise<void> {
    try {
      await this.housesRepository.delete(houseIds);
    } catch (error: any) {
      throw new InternalServerErrorException(FAILED_REMOVE_HOUSES);
    }
  }
}
