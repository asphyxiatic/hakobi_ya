import { UserEntity } from '../../users/entities/user.entity.js';

export class RegisterResponseDto {
  user!: UserEntity;
  accessToken!: string;
  refreshToken!: string;
}
