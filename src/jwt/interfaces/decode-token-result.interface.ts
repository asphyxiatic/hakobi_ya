import { Role } from '../../users/enums/role.enum.js';

export interface DecodeTokenResponse {
  id: string;
  login: string;
  roles: Role[];
}
