import { HouseEntity } from '../../houses/entities/house.entity.js';

export interface CreateEntranceOptions {
  houseId: HouseEntity['id'];
  quantity: number;
}
