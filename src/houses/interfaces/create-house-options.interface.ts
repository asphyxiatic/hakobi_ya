import { StreetEntity } from '../../streets/entities/street.entity.js';
import { HouseEntity } from '../entities/house.entity.js';

export interface CreateHouseOptions {
  streetId: StreetEntity['id'];
  houseName: HouseEntity['houseName'];
  quantityEntrances: number;
}
