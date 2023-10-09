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

@Injectable()
export class StreetsService {
  constructor(
    @InjectRepository(StreetEntity)
    private readonly streetsRepository: Repository<StreetEntity>,
  ) {}

  // ----------------------------------------------------------------------
  public async getFullStreetInformation(): Promise<StreetEntity[]> {
    return this.streetsRepository.find({
      relations: ['houses', 'houses.entrances'],
    });
  }

  // ----------------------------------------------------------------------
  public async findOne(
    findOptions: FindOptionsWhere<StreetEntity>,
  ): Promise<StreetEntity> {
    return this.streetsRepository.findOne({ where: findOptions });
  }

  // ----------------------------------------------------------------------
  public async save(saveOptions: Partial<StreetEntity>): Promise<StreetEntity> {
    const savedStreet = await this.streetsRepository.save(saveOptions);

    return this.findOne({ id: savedStreet.id });
  }

  // ----------------------------------------------------------------------
  public async create(nameStreet: string): Promise<StreetEntity> {
    return this.save({ nameStreet: nameStreet });
  }

  // ----------------------------------------------------------------------
  public async update(
    streetId: string,
    nameStreet: string,
  ): Promise<StreetEntity> {
    const street = this.findOne({ id: streetId });

    if (!street) throw new NotFoundException(STREET_NOT_FOUND);

    return this.save({
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
