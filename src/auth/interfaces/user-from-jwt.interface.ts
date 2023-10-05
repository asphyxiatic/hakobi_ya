import { Role } from '../../users/enums/role.enum.js';

export interface UserFromJwt {
  id: string;
  login?: string;
  email?: string;
  roles: Role[];
}
