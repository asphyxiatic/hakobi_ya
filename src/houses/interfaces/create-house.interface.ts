import { StreetEntity } from '../../streets/entities/street.entity.js';
import { HouseEntity } from '../entities/house.entity.js';

export interface CreateHouse {
  streetId: StreetEntity['id'];
  houseName: HouseEntity['houseName'];
  quantityEntrances: number;
}
