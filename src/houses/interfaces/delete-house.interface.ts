import { HouseEntity } from '../entities/house.entity.js';

export interface DeleteHouse {
  houseIds: HouseEntity['id'][];
}
