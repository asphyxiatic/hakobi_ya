import { Role } from '../../users/enums/role.enum';

export interface RegisterUserWsEventResponse {
  id: string;
  login: string;
  roles: Role[];
}
