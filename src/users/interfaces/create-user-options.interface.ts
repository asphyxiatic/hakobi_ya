import { RoleType } from '../types/role.type.js';
import { UserCredentials } from './user-credentials.interface.js';

export interface CreateUserOptions extends UserCredentials {
  role: RoleType;
}
