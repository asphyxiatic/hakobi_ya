import { EntrancesResponse } from '../../entrances/interfaces/entrances-response.interface.js';

export interface CreateHouseResponse {
  id: string;
  houseName: string;
  streetId: string;
  entrances: EntrancesResponse[];
}
