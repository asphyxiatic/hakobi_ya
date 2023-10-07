import { Role } from '../../users/enums/role.enum.js';

export interface UserFromJwt {
  userId: string;
  login: string;
  roles: Role[];
}
