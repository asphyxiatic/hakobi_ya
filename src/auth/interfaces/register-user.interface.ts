import { Role } from '../../users/enums/role.enum';
import { UserCredentials } from './user-credentials.interface';

export interface RegisterUserResponse {
  id: string;
  roles: Role[];

  credentials: UserCredentials;
}
