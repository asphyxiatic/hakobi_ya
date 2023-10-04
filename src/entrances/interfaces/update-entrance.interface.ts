import { HouseEntity } from '../../houses/entities/house.entity.js';

export interface UpdateEntrance {
  houseId: HouseEntity['id'];
  quantity: number;
}
