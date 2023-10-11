import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StreetEntity } from '../entities/street.entity.js';

import {
  FAILED_REMOVE_STREETS,
  STREET_NOT_FOUND,
} from '../../common/errors/errors.constants.js';
import { StreetResponse } from '../interfaces/street-response.interface.js';
import { StreetFindOneResponse } from '../interfaces/street-find-one-response.interface.js';

@Injectable()
export class StreetsService {
  constructor(
    @InjectRepository(StreetEntity)
    private readonly streetsRepository: Repository<StreetEntity>,
  ) {}

  // ----------------------------------------------------------------------
  public async getAllStreet(): Promise<StreetResponse[]> {
    return this.streetsRepository
      .createQueryBuilder('street')
      .leftJoinAndSelect('street.houses', 'houses')
      .leftJoinAndSelect('houses.entrances', 'entrances')
      .select(['street.id', 'street.nameStreet'])
      .addSelect(['houses.id', 'houses.houseName'])
      .addSelect(['entrances.numberEntrance', 'entrances.completed'])
      .getMany();
  }

  // ----------------------------------------------------------------------
  public async findOneWithRelations(
    findOptions: FindOptionsWhere<StreetEntity>,
  ): Promise<StreetResponse> {
    return this.streetsRepository
      .createQueryBuilder('street')
      .leftJoinAndSelect('street.houses', 'houses')
      .leftJoinAndSelect('houses.entrances', 'entrances')
      .select(['street.id', 'street.nameStreet'])
      .addSelect(['houses.id', 'houses.houseName'])
      .addSelect(['entrances.numberEntrance', 'entrances.completed'])
      .where(findOptions)
      .getOne();
  }

  // ----------------------------------------------------------------------
  public async findOne(
    findOptions: FindOptionsWhere<StreetFindOneResponse>,
  ): Promise<Partial<StreetEntity>> {
    return this.streetsRepository.findOne({
      where: findOptions,
      select: ['id', 'nameStreet'],
    });
  }

  // ----------------------------------------------------------------------
  public async saveAndSelect(
    saveOptions: Partial<StreetResponse>,
  ): Promise<StreetResponse> {
    const savedStreet = await this.streetsRepository.save(saveOptions);

    return this.findOneWithRelations({ id: savedStreet.id });
  }

  // ----------------------------------------------------------------------
  public async create(nameStreet: string): Promise<StreetResponse> {
    return this.saveAndSelect({ nameStreet: nameStreet });
  }

  // ----------------------------------------------------------------------
  public async update(
    streetId: string,
    nameStreet: string,
  ): Promise<StreetResponse> {
    const street = this.findOne({ id: streetId });

    if (!street) throw new NotFoundException(STREET_NOT_FOUND);

    return this.saveAndSelect({
      id: streetId,
      nameStreet: nameStreet,
    });
  }

  // ----------------------------------------------------------------------
  public async delete(streetIds: string[]): Promise<void> {
    try {
      await this.streetsRepository.delete(streetIds);
    } catch (error: any) {
      throw new InternalServerErrorException(FAILED_REMOVE_STREETS);
    }
  }
}
