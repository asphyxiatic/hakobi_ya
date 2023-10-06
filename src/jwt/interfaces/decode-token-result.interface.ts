import { Role } from '../../users/enums/role.enum.js';

export interface DecodeTokenResult {
  id: string;
  login: string;
  roles: Role[];
}
