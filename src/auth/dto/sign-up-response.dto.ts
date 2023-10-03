import { UserEntity } from '../../users/entities/user.entity.js';

export class SignUpResponseDto {
  user!: UserEntity;
  accessToken!: string;
  refreshToken!: string;
}
