import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateUserDto {
  @IsUUID()
  @IsNotEmpty()
    userId!: string;

  @IsString()
  @IsNotEmpty()
    login!: string;
}
