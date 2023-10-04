import { HouseEntity } from '../entities/house.entity.js';

export interface UpdateHouse {
  houseId: HouseEntity['id'];
  houseName?: HouseEntity['houseName'];
  quantityEntrances?: number;
}
