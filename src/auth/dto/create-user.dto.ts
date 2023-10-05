import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RoleType } from '../../users/types/role.type.js';
import { Role } from '../../users/enums/role.enum.js';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  login!: string;

  @IsEnum(Role)
  @IsOptional()
  role!: RoleType;
}
