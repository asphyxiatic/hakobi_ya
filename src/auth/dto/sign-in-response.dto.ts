import { UserEntity } from '../../users/entities/user.entity.js';

export class SignInResponseDto {
  user!: UserEntity;
  accessToken!: string;
  refreshToken!: string;
}
