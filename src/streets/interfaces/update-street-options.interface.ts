import { StreetEntity } from '../entities/street.entity.js';

export interface UpdateStreetOptions {
  streetId: StreetEntity['id'];
  nameStreet: StreetEntity['nameStreet'];
}
