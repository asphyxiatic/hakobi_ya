import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { HouseEntity } from '../entities/house.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { EntrancesService } from '../../entrances/services/entrances.service.js';
import { CreateHouseResponse } from '../interfaces/create-house-response.interface.js';
import { UpdateHouseResponse } from '../interfaces/update-house-response.interface.js';
import {
  FAILED_REMOVE_HOUSES,
  HOUSE_NOT_FOUND,
} from '../../common/errors/errors.constants.js';
import { UpdateHouseOptions } from '../interfaces/update-house-options.interface.js';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(HouseEntity)
    private readonly housesRepository: Repository<HouseEntity>,
    private readonly entrancesService: EntrancesService,
  ) {}

  //-------------------------------------------------------------
  public async findOne(
    findOptions: FindOptionsWhere<HouseEntity>,
  ): Promise<HouseEntity> {
    return this.housesRepository.findOne({ where: findOptions });
  }

  //-------------------------------------------------------------
  public async save(saveOptions: Partial<HouseEntity>): Promise<HouseEntity> {
    const savedHouse = await this.housesRepository.save(saveOptions);

    return this.findOne({ id: savedHouse.id });
  }

  //--------------------------------------------------------------------------
  public async create(
    streetId: string,
    houseName: string,
    quantityEntrances: number,
  ): Promise<CreateHouseResponse> {
    const newHouse = await this.save({
      streetId: streetId,
      houseName: houseName,
    });

    const entrances = await this.entrancesService.createEntrancesForHouse(
      newHouse.id,
      quantityEntrances,
    );

    return {
      id: newHouse.id,
      houseName: newHouse.houseName,
      streetId: newHouse.streetId,
      entrances: entrances,
    };
  }

  //--------------------------------------------------------------------------
  public async update({
    houseId,
    houseName,
    quantityEntrances,
  }: UpdateHouseOptions): Promise<UpdateHouseResponse> {
    const house = await this.housesRepository.findOne({
      where: { id: houseId },
      relations: { entrances: true },
    });

    if (!house) throw new NotFoundException(HOUSE_NOT_FOUND);

    let updateHouse = house;

    if (houseName) {
      updateHouse = await this.save({
        id: houseId,
        houseName: houseName,
      });
    }

    let updateEntrances = house.entrances;

    if (quantityEntrances) {
      updateEntrances = await this.entrancesService.updateEntrancesForHouse(
        houseId,
        quantityEntrances,
      );
    }

    return {
      id: updateHouse.id,
      houseName: updateHouse.houseName,
      streetId: updateHouse.streetId,
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
