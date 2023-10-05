import { StreetEntity } from '../entities/street.entity.js';

export interface DeleteStreetsOptions {
  streetIds: StreetEntity['id'][];
}
