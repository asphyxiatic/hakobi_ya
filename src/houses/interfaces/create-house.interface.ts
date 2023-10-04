import { AddressEntity } from '../../addresses/entities/address.entity.js';
import { HouseEntity } from '../entities/house.entity.js';

export interface CreateHouse {
  addressId: AddressEntity['id'];
  houseName: HouseEntity['houseName'];
  quantityEntrances: number;
}
