import { HouseEntity } from '../../houses/entities/house.entity.js';

export interface CompleteEntranceOptions {
  houseId: HouseEntity['id'];
  numberEntrance: number;
  complete: boolean;
}
