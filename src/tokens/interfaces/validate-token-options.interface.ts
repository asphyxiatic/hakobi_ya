import { UserEntity } from '../../users/entities/user.entity.js';
import { TokenEntity } from '../entities/token.entity.js';

export interface ValidateTokenOptions {
  userId: UserEntity['id'];
  value: TokenEntity['value'];
  fingerprint: TokenEntity['fingerprint'];
}