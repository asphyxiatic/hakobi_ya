import { Role } from '../../users/enums/role.enum.js';

export interface JwtTokenPayload {
  sub: string;
  login?: string;
  email?: string;
  roles: Role[];
}
