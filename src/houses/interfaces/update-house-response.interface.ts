import { EntrancesResponse } from '../../entrances/interfaces/entrances-response.interface.js';

export interface UpdateHouseResponse {
  id: string;
  houseName: string;
  streetId: string;
  entrances: EntrancesResponse[];
}
