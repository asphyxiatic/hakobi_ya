import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @MinLength(8)
  @IsString()
  @IsNotEmpty()
  password!: string;
}
