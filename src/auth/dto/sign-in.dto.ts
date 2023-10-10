import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
    login!: string;

  @MinLength(8)
  @IsString()
  @IsNotEmpty()
    password!: string;
}
