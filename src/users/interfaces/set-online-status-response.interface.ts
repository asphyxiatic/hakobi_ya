import { Role } from '../enums/role.enum';

export interface SetOnlineStatusResponse {
  id: string;
  login: string;
  online: boolean;
  roles: Role[];
}
