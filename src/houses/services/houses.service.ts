import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { HouseEntity } from '../entities/house.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { EntrancesService } from '../../entrances/services/entrances.service.js';
import { CreateHouse } from '../interfaces/create-house.interface.js';
import { UpdateHouse } from '../interfaces/update-house.interface.js';
import { DeleteHouse } from '../interfaces/delete-house.interface.js';

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
  }: CreateHouse): Promise<HouseEntity> {
    const newHouse = await this.housesRepository.save({
      streetId: streetId,
      houseName: houseName,
    });

    const entrances = await this.entrancesService.createEntrancesForHouse({
      houseId: newHouse.id,
      quantity: quantityEntrances,
    });

    return { ...newHouse, entrances: entrances };
  }

  //--------------------------------------------------------------------------
  public async update({
    houseId,
    houseName,
    quantityEntrances,
  }: UpdateHouse): Promise<HouseEntity> {
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
      updateEntrances =
        await this.entrancesService.updateEntrancesForHouse({
          houseId: houseId,
          quantity: quantityEntrances,
        });
    }

    return {
      ...updateHouse,
      entrances: updateEntrances,
    };
  }

  //--------------------------------------------------------------------------
  public async delete({ houseIds }: DeleteHouse): Promise<void> {
    try {
      await this.housesRepository.delete(houseIds);
    } catch (error: any) {
      throw new InternalServerErrorException('🚨 не удалось удалить дом!');
    }
  }
}
