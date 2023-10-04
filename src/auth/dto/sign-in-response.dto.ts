import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity.js';

export class User extends PickType(UserEntity, ['login', 'role'] as const) {}

export class SignInResponseDto {
  user!: User;
  accessToken!: string;
  refreshToken!: string;
}
