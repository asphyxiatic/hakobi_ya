import { Role } from '../enums/role.enum.js';
import { UserCredentials } from './user-credentials.interface.js';

export interface CreateUserOptions extends UserCredentials {
  roles: Role[];
}
