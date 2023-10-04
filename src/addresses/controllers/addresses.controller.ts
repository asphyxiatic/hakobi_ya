import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { WriteAddressesService } from '../services/write-addresses.service.js';
import { CreateAddressDto } from '../dto/create-address.dto.js';
import { GetCurrentUser } from '../../auth/decorators/get-current-user.decorator.js';
import { UserFromJwt } from '../../auth/interfaces/user-from-jwt.interface.js';
import { AddressEntity } from '../entities/address.entity.js';
import { RequestParams } from '../../common/interfaces/request-params.interface.js';
import { UpdateAddressDto } from '../dto/update-address.dto.js';
import { DeleteAddressesDto } from '../dto/delete-addresses.dto.js';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly writeAddressesService: WriteAddressesService) {}

  // @Post()
  // async create(
  //   @Body() { name }: CreateAddressDto,
  //   @GetCurrentUser() { id }: UserFromJwt,
  // ): Promise<AddressEntity> {
  //   return this.writeAddressesService.create(id, name);
  // }

  // @Patch(':addressId')
  // async update(
  //   @Param() { addressId }: RequestParams,
  //   @Body() { name }: UpdateAddressDto,
  // ): Promise<AddressEntity> {
  //   return this.writeAddressesService.update(addressId, name);
  // }

  // @Delete()
  // async delete(@Body() { addressIds }: DeleteAddressesDto): Promise<void> {
  //   return this.writeAddressesService.deleteMany(addressIds);
  // }

  // @Post()
  // async createHouse() {}

  // @Patch()
  // async updateHouse() {}

  // @Delete()
  // async deleteHouses() {}

  // @Post()
  // async activeEntrance() {}
}
