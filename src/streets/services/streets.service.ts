import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StreetEntity } from '../entities/street.entity.js';

@Injectable()
export class StreetsService {
  constructor(
    @InjectRepository(StreetEntity)
    private readonly streetsRepository: Repository<StreetEntity>,
  ) {}

  // ----------------------------------------------------------------------
  public async getAllStreets(): Promise<StreetEntity[]> {
    return this.streetsRepository.find({
      relations: ['houses', 'houses.entrances'],
    });
  }

  // ----------------------------------------------------------------------
  public async create(
    ownerId: StreetEntity['ownerId'],
    name: StreetEntity['name'],
  ): Promise<StreetEntity> {
    try {
      return this.streetsRepository.save({ ownerId: ownerId, name: name });
    } catch (error: any) {
      throw new InternalServerErrorException(`🚨 ${error}`);
    }
  }

  // ----------------------------------------------------------------------
  public async update(
    StreetId: StreetEntity['id'],
    name: StreetEntity['name'],
  ): Promise<StreetEntity> {
    return this.streetsRepository.save({ id: StreetId, name: name });
  }

  // ----------------------------------------------------------------------
  public async deleteMany(StreetIds: string[]): Promise<void> {
    try {
      await this.streetsRepository.delete(StreetIds);
    } catch (error: any) {
      throw new InternalServerErrorException('🚨 не удалось удалить адрес!');
    }
  }
}
