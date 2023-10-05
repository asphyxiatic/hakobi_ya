import { HouseEntity } from '../entities/house.entity.js';

export interface DeleteHousesOptions {
  houseIds: HouseEntity['id'][];
}
