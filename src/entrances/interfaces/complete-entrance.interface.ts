import { HouseEntity } from '../../houses/entities/house.entity.js';

export interface CompleteEntrance {
  houseId: HouseEntity['id'];
  numberEntrance: number;
  complete: boolean;
}
