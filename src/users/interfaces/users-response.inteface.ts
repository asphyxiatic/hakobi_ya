import { Role } from '../enums/role.enum';

export interface UsersResponse {
  id: string;
  login: string;
  roles: Role[];
}
