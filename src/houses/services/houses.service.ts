import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { HouseEntity } from '../entities/house.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { EntrancesService } from '../../entrances/services/entrances.service.js';
import { CreateHouseOptions } from '../interfaces/create-house-options.interface.js';
import { UpdateHouseOptions } from '../interfaces/update-house-options.interface.js';
import { DeleteHousesOptions } from '../interfaces/delete-house-options.interface.js';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(HouseEntity)
    private readonly housesRepository: Repository<HouseEntity>,
    private readonly entrancesService: EntrancesService,
  ) {}

  //--------------------------------------------------------------------------
  public async create({
    streetId,
    houseName,
    quantityEntrances,
  }: CreateHouseOptions): Promise<HouseEntity & { entrancesCount: number }> {
    const newHouse = await this.housesRepository.save({
      streetId: streetId,
      houseName: houseName,
    });

    const entrances = await this.entrancesService.createEntrancesForHouse({
      houseId: newHouse.id,
      quantity: quantityEntrances,
    });

    return { ...newHouse, entrancesCount: entrances.length };
  }

  //--------------------------------------------------------------------------
  public async update({
    houseId,
    houseName,
    quantityEntrances,
  }: UpdateHouseOptions): Promise<HouseEntity> {
    const house = await this.housesRepository.findOne({
      where: { id: houseId },
      relations: { entrances: true },
    });

    if (!house) {
      throw new NotFoundException('🚨 не найден дом в базе данных!');
    }

    let updateHouse = house;

    if (houseName) {
      updateHouse = await this.housesRepository.save({
        id: houseId,
        houseName: houseName,
      });
    }

    let updateEntrances = house.entrances;

    if (quantityEntrances) {
      updateEntrances = await this.entrancesService.updateEntrancesForHouse({
        houseId: houseId,
        updatedQuantity: quantityEntrances,
      });
    }

    return {
      ...updateHouse,
      entrances: updateEntrances,
    };
  }

  //--------------------------------------------------------------------------
  public async delete({ houseIds }: DeleteHousesOptions): Promise<void> {
    try {
      await this.housesRepository.delete(houseIds);
    } catch (error: any) {
      throw new InternalServerErrorException('🚨 не удалось удалить дома!');
    }
  }
}
