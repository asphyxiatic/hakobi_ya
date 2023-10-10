import { Role } from '../enums/role.enum';

export interface GetAllUsersResponse {
  id: string;
  login: string;
  roles: Role[];
  online: boolean;
}
