import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StreetEntity } from '../entities/street.entity.js';
import { CreateStreetOptions } from '../interfaces/create-street-options.interface.js';
import { UpdateStreetOptions } from '../interfaces/update-street-options.interface.js';
import { DeleteStreetsOptions } from '../interfaces/delete-street-options.interface.js';

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
  public async create(
    createOptions: CreateStreetOptions,
  ): Promise<StreetEntity> {
    try {
      return this.streetsRepository.save(createOptions);
    } catch (error: any) {
      throw new InternalServerErrorException(
        `🚨 ошибка сохранения улицы в базу данных!`,
      );
    }
  }

  // ----------------------------------------------------------------------
  public async update(
    updateOptions: UpdateStreetOptions,
  ): Promise<StreetEntity> {
    const street = this.findOne({ id: updateOptions.streetId });

    if (!street) {
      throw new NotFoundException('🚨 не найдена улица!');
    }

    return this.streetsRepository.save(updateOptions);
  }

  // ----------------------------------------------------------------------
  public async delete({ streetIds }: DeleteStreetsOptions): Promise<void> {
    try {
      await this.streetsRepository.delete(streetIds);
    } catch (error: any) {
      throw new InternalServerErrorException('🚨 не удалось удалить улицу!');
    }
  }
}
