import { HouseEntity } from '../entities/house.entity.js';

export interface UpdateHouseOptions {
  houseId: HouseEntity['id'];
  houseName?: HouseEntity['houseName'];
  quantityEntrances?: number;
}
