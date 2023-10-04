import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  login!: string;

  @Length(8)
  @IsString()
  @IsNotEmpty()
  password!: string;
}
