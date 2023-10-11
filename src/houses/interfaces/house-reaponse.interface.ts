import { EntranceResponse } from '../../entrances/interfaces/entrance-response.interface';
import { HouseFindOneResponse } from './house-find-one-response.interface';

export interface HouseResponse extends HouseFindOneResponse {
  entrances: EntranceResponse[];
}
