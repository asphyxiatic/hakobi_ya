import { TokensResponse } from './tokens-response.interface.js';
import { UserFromJwt } from './user-from-jwt.interface.js';

export interface SignInResponse extends TokensResponse {
  user: UserFromJwt;
}
