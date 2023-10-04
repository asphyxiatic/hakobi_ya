import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AddressEntity } from '../entities/address.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WriteAddressesService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressesRepository: Repository<AddressEntity>,
  ) {}

  public async create(
    ownerId: AddressEntity['ownerId'],
    name: AddressEntity['name'],
  ): Promise<AddressEntity> {
    return this.addressesRepository.save({ ownerId: ownerId, name: name });
  }

  public async update(
    addressId: AddressEntity['id'],
    name: AddressEntity['name'],
  ): Promise<AddressEntity> {
    return this.addressesRepository.save({ id: addressId, name: name });
  }

  public async deleteMany(addressIds: string[]): Promise<void> {
    try {
      await this.addressesRepository.delete(addressIds);
    } catch (error: any) {
      throw new InternalServerErrorException('🚨 не удалось удалить адрес!');
    }
  }
}
