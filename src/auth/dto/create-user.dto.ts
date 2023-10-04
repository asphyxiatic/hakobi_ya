import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole, userRoles } from '../../users/types/user-roles.js';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  login!: string;

  @IsIn(userRoles)
  @IsOptional()
  role!: UserRole;
}
