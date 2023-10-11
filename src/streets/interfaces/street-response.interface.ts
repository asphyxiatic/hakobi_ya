import { HouseResponse } from '../../houses/interfaces/house-reaponse.interface';
import { StreetFindOneResponse } from './street-find-one-response.interface';

export interface StreetResponse extends StreetFindOneResponse {
  houses: HouseResponse[];
}
