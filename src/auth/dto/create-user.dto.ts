import {
  ArrayUnique,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../../users/enums/role.enum.js';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  login!: string;

  @IsEnum(Role, { each: true })
  @ArrayUnique()
  @IsOptional()
  roles!: Role[];
}
