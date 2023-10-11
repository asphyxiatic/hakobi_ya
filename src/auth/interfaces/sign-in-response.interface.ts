import { UsersResponse } from '../../users/interfaces/users-response.inteface.js';
import { TokensResponse } from './tokens-response.interface.js';

export interface SignInResponse extends TokensResponse {
  user: UsersResponse;
}
