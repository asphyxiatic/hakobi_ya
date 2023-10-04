import { HouseEntity } from '../../houses/entities/house.entity.js';

export interface CreateEntrance {
  houseId: HouseEntity['id'];
  quantity: number;
}
