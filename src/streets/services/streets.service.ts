import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StreetEntity } from '../entities/street.entity.js';

import {
  FAILED_REMOVE_STREETS,
  STREET_NOT_FOUND,
} from '../../common/errors/errors.constants.js';
import { StreetResponse } from '../interfaces/street-response.interface.js';
import { StreetFindOneResponse } from '../interfaces/street-find-one-response.interface.js';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class StreetsService {
  constructor(
    @InjectRepository(StreetEntity)
    private readonly streetsRepository: Repository<StreetEntity>,
  ) {}

  // ----------------------------------------------------------------------
  public async getAllStreet(): Promise<StreetResponse[]> {
    return this.configureFindStreetQuery(
      this.streetsRepository.createQueryBuilder('street'),
    ).getMany();
  }

  // ----------------------------------------------------------------------
  public async findOneWithRelations(
    findOptions: FindOptionsWhere<StreetEntity>,
  ): Promise<StreetResponse | undefined> {
    return this.configureFindStreetQuery(
      this.streetsRepository.createQueryBuilder('street'),
    )
      .where(findOptions)
      .getOne();
  }

  // ----------------------------------------------------------------------
  public async findOne(
    findOptions: FindOptionsWhere<StreetEntity>,
  ): Promise<StreetFindOneResponse | undefined> {
    return this.streetsRepository.findOne({
      where: findOptions,
      select: ['id', 'nameStreet'],
    });
  }

  // ----------------------------------------------------------------------
  public async saveAndSelect(
    saveOptions: Partial<StreetEntity>,
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

    if (!street) throw new WsException(STREET_NOT_FOUND);

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
      throw new WsException(FAILED_REMOVE_STREETS);
    }
  }

  private configureFindStreetQuery(
    queryBuilder: SelectQueryBuilder<StreetEntity>,
  ): SelectQueryBuilder<StreetEntity> {
    return queryBuilder
      .leftJoinAndSelect('street.houses', 'houses')
      .leftJoinAndSelect('houses.entrances', 'entrances')
      .select(['street.id', 'street.nameStreet'])
      .addSelect(['houses.id', 'houses.houseName', 'houses.streetId'])
      .addSelect([
        'entrances.numberEntrance',
        'entrances.completed',
        'entrances.houseId',
      ])
      .orderBy('street.createdAt', 'DESC')
      .addOrderBy('houses.createdAt', 'DESC')
      .addOrderBy('entrances.numberEntrance', 'ASC');
  }
}
