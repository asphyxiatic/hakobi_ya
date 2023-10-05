import { HouseEntity } from '../../houses/entities/house.entity.js';

export interface UpdateEntranceOptions {
  houseId: HouseEntity['id'];
  updatedQuantity: number;
}
