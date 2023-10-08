import { Role } from '../../users/enums/role.enum.js';

export interface JwtTokenPayload {
  userId: string;
  roles: Role[];
  login: string;
}
