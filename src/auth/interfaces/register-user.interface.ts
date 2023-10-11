import { Role } from '../../users/enums/role.enum';

export interface RegisterUserResponse {
  id: string;
  online: boolean;
  roles: Role[];

  credentials: {
    login: string;
    password: string;
  };
}
